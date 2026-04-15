# 🎬 CineMatch — AI Movie Recommendation System

> A full-stack Netflix-style movie recommendation system powered by TF-IDF Vectorization & Cosine Similarity.

## 📹 Live Demo

![App Demo Recording](C:\Users\HP\.gemini\antigravity\brain\afd96aa0-e9cc-40ed-871b-8c916aca1ce5\artifacts\app_demo.webp)

---

## 🖼️ Screenshots

````carousel
### Landing Page
![Landing page with hero section, search bar, and quick search chips](C:\Users\HP\.gemini\antigravity\brain\afd96aa0-e9cc-40ed-871b-8c916aca1ce5\artifacts\initial_load.png)

Dark theme with cinematic background, glassmorphism search bar, AI-Powered badge, and Quick Search trending chips.
<!-- slide -->
### Recommendation Results
![Movie recommendation cards for Inception](C:\Users\HP\.gemini\antigravity\brain\afd96aa0-e9cc-40ed-871b-8c916aca1ce5\artifacts\recommendation_results.png)

5 movie cards with rank badges, similarity scores, genre tags, ratings, and genre-based gradient backgrounds.
<!-- slide -->
### How It Works + Footer
![How it works section and footer](C:\Users\HP\.gemini\antigravity\brain\afd96aa0-e9cc-40ed-871b-8c916aca1ce5\artifacts\footer_section.png)

Educational 3-step section explaining TF-IDF + Cosine Similarity, plus tech stack footer.
````

---

## 🏗️ Architecture

```mermaid
graph LR
    A["👤 User"] -->|"Types movie name"| B["⚛️ React Frontend<br/>localhost:3000"]
    B -->|"POST /recommend"| C["🔄 Vite Proxy"]
    C -->|"Forwards to"| D["🐍 Flask Backend<br/>localhost:5000"]
    D -->|"1. Preprocess text"| E["🧠 ML Engine"]
    E -->|"2. TF-IDF Vectorize"| F["📊 Feature Matrix"]
    F -->|"3. Cosine Similarity"| G["📈 Similarity Scores"]
    G -->|"4. Top 5 results"| D
    D -->|"JSON response"| B
    B -->|"Renders cards"| A
```

---

## 📂 Project Structure

| File | Purpose |
|------|---------|
| [app.py](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/backend/app.py) | Flask API server with TF-IDF engine |
| [movies_data.py](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/backend/movies_data.py) | Curated 50-movie dataset |
| [requirements.txt](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/backend/requirements.txt) | Python dependencies |
| [App.jsx](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/frontend/src/App.jsx) | React app with all components |
| [App.css](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/frontend/src/App.css) | Netflix-style component styles |
| [index.css](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/frontend/src/index.css) | Global CSS design system |
| [vite.config.js](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/frontend/vite.config.js) | Vite config with API proxy |
| [README.md](file:///c:/Users/HP/OneDrive/Desktop/movie_recomendation_system/README.md) | Full documentation |

---

## 🚀 How to Run

### Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# → Runs on http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# → Runs on http://localhost:3000
```

---

## 🧠 ML Explanation: TF-IDF + Cosine Similarity

### TF-IDF (Term Frequency — Inverse Document Frequency)

Converts movie descriptions into numerical vectors:

| Term | TF (in doc) | IDF (across all docs) | TF-IDF Score |
|------|-------------|----------------------|--------------|
| "dream" | 0.08 | 3.91 | 0.313 |
| "heist" | 0.04 | 3.91 | 0.156 |
| "the" | 0.12 | 0.10 | 0.012 |

> [!TIP]
> Words that are **frequent in one document** but **rare overall** get the highest scores — making them the best discriminators for similarity matching.

### Cosine Similarity

Measures the angle between two TF-IDF vectors:
- **1.0** = Identical content
- **0.0** = Completely different
- Focuses on **direction** (content), not **magnitude** (length)

---

## ✨ Key Features

| Category | Features |
|----------|----------|
| **Backend** | TF-IDF with bigrams, cosine similarity, fuzzy search, autocomplete API, error handling with suggestions |
| **Frontend** | Dark Netflix theme, glassmorphism, autocomplete dropdown, genre-based card gradients, hover zoom effects, loading/error states |
| **UX** | Keyboard navigation, responsive design, smooth animations, educational "How It Works" section |

---

## 🔌 API Reference

| Method | Endpoint | Body/Params | Response |
|--------|----------|-------------|----------|
| `POST` | `/recommend` | `{"movie": "Inception"}` | Top 5 similar movies with scores |
| `GET` | `/movies` | — | All 50 movies |
| `GET` | `/movies/search?q=dark` | `q` param | Autocomplete matches |

---

> [!NOTE]
> Both servers must be running simultaneously. The Vite dev server proxies API calls to Flask automatically.
