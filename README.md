# 🎬 CineMatch — AI Movie Recommendation System

A full-stack movie recommendation system with a **Netflix-style** user interface, powered by **TF-IDF Vectorization** and **Cosine Similarity**.

Built with **React** (frontend), **Flask** (backend), and **scikit-learn** (ML).

---

## 📁 Project Structure

```
movie_recomendation_system/
├── backend/
│   ├── app.py              # Flask API server with ML engine
│   ├── movies_data.py      # Curated dataset of 50 movies
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── hero_bg.png     # Hero section background image
│   ├── src/
│   │   ├── App.jsx         # Main React app with all components
│   │   ├── App.css         # Netflix-style component styles
│   │   ├── index.css       # Global design system (CSS tokens)
│   │   └── main.jsx        # React entry point
│   ├── index.html          # HTML template with SEO meta tags
│   ├── vite.config.js      # Vite config with API proxy
│   └── package.json        # Node dependencies
└── README.md               # This file
```

---

## 🚀 How to Run

### Prerequisites
- **Python 3.8+** installed
- **Node.js 18+** installed
- **npm** (comes with Node.js)

### Step 1: Start the Backend (Flask API)

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend will run on **http://localhost:5000**

### Step 2: Start the Frontend (React)

```bash
# Open a new terminal
cd frontend

# Install Node dependencies (if not already installed)
npm install

# Start React dev server
npm run dev
```

The frontend will run on **http://localhost:3000**

### Step 3: Open the App

Open your browser and navigate to **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/recommend`       | Get movie recommendations            |
| GET    | `/movies`          | List all movies in the database      |
| GET    | `/movies/search?q=`| Autocomplete search suggestions      |
| GET    | `/`                | Health check                         |

### Example: POST `/recommend`

**Request:**
```json
{
  "movie": "Inception"
}
```

**Response:**
```json
{
  "success": true,
  "movie": "Inception",
  "count": 5,
  "recommendations": [
    {
      "id": 21,
      "title": "Mad Max: Fury Road",
      "genre": "Action, Adventure, Sci-Fi",
      "description": "In a post-apocalyptic wasteland...",
      "year": 2015,
      "rating": 8.1,
      "similarity_score": 0.0601
    },
    ...
  ]
}
```

### Example: Error Response

```json
{
  "success": false,
  "error": "Movie 'xyz' not found in our database.",
  "suggestions": [
    { "id": 1, "title": "The Dark Knight", "genre": "Action, Crime, Drama", "year": 2008 }
  ]
}
```

---

## 🧠 How TF-IDF and Cosine Similarity Work

### TF-IDF (Term Frequency — Inverse Document Frequency)

TF-IDF converts text into numerical vectors that represent the importance of words.

**Formula:**
```
TF-IDF(word, doc) = TF(word, doc) × IDF(word)
```

- **TF (Term Frequency):** How often a word appears in a specific document.
  ```
  TF = (Number of times word appears in document) / (Total words in document)
  ```

- **IDF (Inverse Document Frequency):** How rare/unique a word is across ALL documents.
  ```
  IDF = log(Total number of documents / Number of documents containing the word)
  ```

**Why it works:** Common words like "the" or "movie" get low scores (they appear everywhere). Unique words like "spaceship" or "heist" get high scores — making them better at distinguishing content.

### Cosine Similarity

Cosine Similarity measures how similar two documents are by computing the cosine of the angle between their TF-IDF vectors.

**Formula:**
```
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)
```

- **Result = 1.0:** Documents are identical
- **Result = 0.0:** Documents are completely different
- **Result = 0.5:** Documents share moderate similarity

**In our system:**
1. Each movie's genre + description is combined into a text feature
2. TF-IDF converts all 50 movies into numerical vectors
3. Cosine similarity computes a 50×50 matrix of pairwise similarities
4. For a given movie, we sort all others by similarity and return the top 5

---

## 🔗 Frontend-Backend Integration

1. The React frontend runs on **port 3000**
2. The Flask backend runs on **port 5000**
3. Vite's dev server proxies `/recommend` and `/movies` requests to Flask
4. CORS is also enabled on Flask as a fallback

**Flow:**
```
User types movie → React sends POST /recommend → 
Vite proxy forwards to Flask:5000 → 
Flask processes with TF-IDF + Cosine Similarity → 
Returns JSON → React renders movie cards
```

---

## ✨ Features

### Backend
- ✅ 50-movie curated dataset with title, genre, description, year, rating
- ✅ TF-IDF Vectorization with bigrams and English stop-word removal
- ✅ Cosine Similarity for content-based filtering
- ✅ Partial title matching (fuzzy search)
- ✅ Autocomplete search API
- ✅ Graceful error handling with suggestions
- ✅ CORS enabled for cross-origin requests

### Frontend
- ✅ Dark Netflix-inspired theme
- ✅ Glassmorphism search bar
- ✅ Real-time autocomplete suggestions
- ✅ Keyboard navigation for autocomplete (↑↓ arrows, Enter, Escape)
- ✅ Genre-based gradient card backgrounds
- ✅ Hover zoom effects (Netflix-style card scaling)
- ✅ Similarity score badges on cards
- ✅ Rank badges (#1–#5)
- ✅ Loading spinner with animation
- ✅ Error state with "Did you mean?" suggestions
- ✅ Quick Search trending chips
- ✅ "How It Works" educational section
- ✅ Responsive design (mobile + desktop)
- ✅ Smooth scroll-to-results
- ✅ Floating particle effects
- ✅ Header scroll transition

---

## 🔮 Extending with TMDB (Future)

To integrate the real TMDB API:

1. Get an API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Replace the `movies_data.py` dataset with TMDB API calls
3. Use TMDB poster URLs for real movie images
4. Example TMDB endpoint:
   ```
   GET https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY&query=Inception
   ```

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React + Vite                  |
| Styling    | Vanilla CSS (custom tokens)   |
| Backend    | Python Flask                  |
| ML Engine  | scikit-learn (TF-IDF + Cosine)|
| Font       | Inter (Google Fonts)          |

---

## 📝 License

Built for educational and demonstration purposes.
