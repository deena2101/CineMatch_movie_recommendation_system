import pandas as pd
import json
import difflib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Precompute TF-IDF matrix and similarities
# This is loaded once when the server starts
movies_df = None
cosine_sim = None
indices = None

def load_dataset():
    global movies_df, cosine_sim, indices
    print("Loading TMDB dataset...")
    
    try:
        # Load the dataset
        df = pd.read_csv('../dataset/tmdb_5000_movies.csv')
        
        # Fill missing values
        df['overview'] = df['overview'].fillna('')
        df['genres'] = df['genres'].fillna('[]')
        df['keywords'] = df['keywords'].fillna('[]')
        df['release_date'] = df['release_date'].fillna('')
        
        # Parse JSON columns
        def parse_json_col(col):
            try:
                return [i['name'] for i in json.loads(col)]
            except:
                return []
                
        df['genres_list'] = df['genres'].apply(parse_json_col)
        df['keywords_list'] = df['keywords'].apply(parse_json_col)
        
        # Create a formatted genre string for the API response
        df['genre_str'] = df['genres_list'].apply(lambda x: ', '.join(x) if x else 'Unknown')
        
        # Create a 'soup' of text for TF-IDF (combine overview, genres, keywords)
        df['soup'] = df['overview'] + ' ' + \
                     df['genres_list'].apply(lambda x: ' '.join(x)) + ' ' + \
                     df['keywords_list'].apply(lambda x: ' '.join(x))
                     
        # TF-IDF Vectorization
        print("Computing TF-IDF matrix...")
        tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), min_df=3)
        tfidf_matrix = tfidf.fit_transform(df['soup'])
        
        # Compute cosine similarity map
        print("Computing Cosine Similarity...")
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

        # Drop large unnecessary columns to save memory if needed, but we keep df
        movies_df = df
        
        # Create a reverse mapping of titles to indices for fast lookup
        # lowercased for case-insensitive matching
        indices = pd.Series(df.index, index=df['title'].str.lower()).drop_duplicates()
        
        print("Dataset loaded and Similarity Matrix computed successfully!")
        
    except Exception as e:
        print(f"Error loading dataset: {e}")

def get_closest_title(query):
    query_lower = query.lower().strip()
    
    # Exact match first
    if query_lower in indices:
        return indices[query_lower].index if isinstance(indices[query_lower], pd.Series) else query_lower
        
    # Fuzzy matching using difflib
    titles = indices.index.tolist()
    matches = difflib.get_close_matches(query_lower, titles, n=1, cutoff=0.6)
    
    if matches:
        return matches[0]
    return None

def find_common_features(movie_idx1, movie_idx2):
    """Find common genres and keywords to explain the recommendation"""
    genres1 = set(movies_df.iloc[movie_idx1]['genres_list'])
    genres2 = set(movies_df.iloc[movie_idx2]['genres_list'])
    common_genres = genres1.intersection(genres2)
    
    kw1 = set(movies_df.iloc[movie_idx1]['keywords_list'])
    kw2 = set(movies_df.iloc[movie_idx2]['keywords_list'])
    common_kws = kw1.intersection(kw2)
    
    reasons = []
    if common_genres:
        reasons.append(f"shares genres: {', '.join(list(common_genres)[:3])}")
    if common_kws:
        reasons.append(f"shares themes: {', '.join(list(common_kws)[:3])}")
        
    if reasons:
        return "Recommended because it " + " and ".join(reasons)
    return "Recommended based on overall content similarity"

def get_recommendations(title, top_n=5):
    closest_title = get_closest_title(title)
    
    if not closest_title:
        return None, "Movie not found. Please try another search.", None
        
    idx = indices[closest_title]
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0] # Take first if multiple exist
        
    matched_title = movies_df.iloc[idx]['title']
    
    # Get similarity scores for all movies
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort by similarity score descending
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top N (skip 0 which is the movie itself)
    sim_scores = sim_scores[1:top_n+1]
    
    movie_indices = [i[0] for i in sim_scores]
    similarities = [i[1] for i in sim_scores]
    
    recommendations = []
    for i, score in zip(movie_indices, similarities):
        movie = movies_df.iloc[i]
        
        # Calculate percentage match
        match_percentage = round(score * 100, 1)
        
        explain_text = find_common_features(idx, i)
        
        year = str(movie['release_date'])[:4] if pd.notna(movie['release_date']) else "Unknown"
        
        recommendations.append({
            "id": int(movie['id']),
            "title": str(movie['title']),
            "genre": str(movie['genre_str']),
            "description": str(movie['overview']),
            "year": year,
            "rating": float(movie['vote_average']),
            "similarity_score": round(float(score), 4),
            "match_percentage": match_percentage,
            "explainability": explain_text
        })
        
    return recommendations, matched_title, True

def get_trending(top_n=10):
    if movies_df is None:
        return []
    
    # Sort by popularity
    trending_df = movies_df.sort_values('popularity', ascending=False).head(top_n)
    
    results = []
    for _, movie in trending_df.iterrows():
        year = str(movie['release_date'])[:4] if pd.notna(movie['release_date']) else "Unknown"
        results.append({
            "id": int(movie['id']),
            "title": str(movie['title']),
            "genre": str(movie['genre_str']),
            "year": year,
            "rating": float(movie['vote_average'])
        })
    return results

def get_search_suggestions(query, limit=10):
    if movies_df is None or not query:
        return []
        
    query_lower = query.lower().strip()
    
    # Exact prefixes
    matches = movies_df[movies_df['title'].str.lower().str.startswith(query_lower)]
    
    # If not enough prefixes, fallback to contains
    if len(matches) < limit:
        contains = movies_df[
            movies_df['title'].str.lower().str.contains(query_lower, na=False) &
            ~movies_df['title'].str.lower().str.startswith(query_lower)
        ]
        matches = pd.concat([matches, contains])
        
    matches = matches.head(limit)
    
    results = []
    for _, movie in matches.iterrows():
        year = str(movie['release_date'])[:4] if pd.notna(movie['release_date']) else "Unknown"
        results.append({
            "id": int(movie['id']),
            "title": str(movie['title']),
            "genre": str(movie['genre_str']),
            "year": year
        })
    return results
