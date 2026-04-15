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


## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React + Vite                  |
| Styling    | Vanilla CSS (custom tokens)   |
| Backend    | Python Flask                  |
| ML Engine  | scikit-learn (TF-IDF + Cosine)|
| Font       | Inter (Google Fonts)          |

---

## 📹 Live Demo

https://drive.google.com/drive/folders/1ROF099lC1h_QBtKxhF5c5TuWhIaoTsWr

## 🖼️ Screenshots


## 📝 License

Built for educational and demonstration purposes.
