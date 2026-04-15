from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

# Import functions from our newly created loader module
import dataset_loader

app = Flask(__name__)
CORS(app)

# Load dataset and compute similarity matrix on server startup
dataset_loader.load_dataset()

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        
        if not data or 'movie' not in data:
            return jsonify({
                "success": False,
                "error": "Please provide a movie name."
            }), 400
        
        movie_name = data['movie'].strip()
        
        if not movie_name:
            return jsonify({
                "success": False,
                "error": "Movie name cannot be empty."
            }), 400
            
        recommendations, matched_title_or_error, success = dataset_loader.get_recommendations(movie_name, top_n=9)
        
        if not success:
            suggestions = dataset_loader.get_search_suggestions(movie_name, limit=5)
            return jsonify({
                "success": False,
                "error": matched_title_or_error,
                "suggestions": suggestions
            }), 404
            
        return jsonify({
            "success": True,
            "movie": matched_title_or_error,
            "recommendations": recommendations,
            "count": len(recommendations)
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"An internal error occurred: {str(e)}"
        }), 500

@app.route('/movies/search', methods=['GET'])
def search_movies():
    query = request.args.get('q', '').strip()
    
    if not query:
        return jsonify({"success": True, "results": [], "count": 0}), 200
        
    results = dataset_loader.get_search_suggestions(query)
    
    return jsonify({
        "success": True,
        "results": results,
        "count": len(results)
    }), 200

@app.route('/trending', methods=['GET'])
def get_trending():
    results = dataset_loader.get_trending(top_n=10)
    return jsonify({
        "success": True,
        "results": results
    }), 200

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "service": "Movie Recommendation API",
        "version": "2.0",
        "endpoints": {
            "POST /recommend": "Get movie recommendations",
            "GET /movies/search?q=": "Autocomplete movies",
            "GET /trending": "Get popular movies"
        }
    }), 200

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("  Advanced AI Movie Recommendation API Server")
    print("  Running on http://localhost:5000")
    print("=" * 60 + "\n")
    app.run(debug=True, port=5000, use_reloader=False) # disabled reloader to prevent reloading huge csv twice
