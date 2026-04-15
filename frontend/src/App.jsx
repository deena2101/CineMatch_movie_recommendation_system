import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const TMDB_API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb'

// ============================================================
// Original Gradient Palettes for fallback
// ============================================================
const GENRE_COLORS = {
  'Action': ['#1a0000', '#4a0000', '#8b0000'],
  'Adventure': ['#0a1a0a', '#1a3a1a', '#2d5a2d'],
  'Animation': ['#1a0a2e', '#2d1a4a', '#4a2d6e'],
  'Biography': ['#1a1a0a', '#3a3a1a', '#5a5a2d'],
  'Comedy': ['#2e1a0a', '#4a2d1a', '#6e4a2d'],
  'Crime': ['#0a0a1a', '#1a1a3a', '#2d2d5a'],
  'Drama': ['#1a0a1a', '#3a1a3a', '#5a2d5a'],
  'Fantasy': ['#0a1a2e', '#1a2d4a', '#2d4a6e'],
  'Horror': ['#0a0a0a', '#1a1a1a', '#2d2d2d'],
  'Sci-Fi': ['#0a0a2e', '#1a1a4a', '#2d2d6e'],
  'default': ['#1a1a2e', '#2a2a3e', '#3a3a4e'],
}

const GENRE_ICONS = {
  'Action': '💥', 'Adventure': '🗺️', 'Animation': '✨', 'Comedy': '😂',
  'Crime': '🔫', 'Drama': '🎭', 'Fantasy': '🐉', 'Horror': '👻',
  'Sci-Fi': '🚀', 'default': '🎬'
}

function getCardGradient(genre) {
  if (!genre) return `linear-gradient(180deg, #1a1a2e 0%, #2a2a3e 50%, #3a3a4e 100%)`;
  const firstGenre = genre.split(',')[0].trim();
  const colors = GENRE_COLORS[firstGenre] || GENRE_COLORS['default'];
  return `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
}

function getGenreIcon(genre) {
  if (!genre) return '🎬';
  const firstGenre = genre.split(',')[0].trim();
  return GENRE_ICONS[firstGenre] || GENRE_ICONS['default'];
}

function Header({ scrolled }) {
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <div className="logo-icon">🎬</div>
        <div className="logo-text">Cine<span>Match</span></div>
      </div>
      <nav className="nav-info">
        <div className="nav-badge"><span className="dot"></span> </div>
      </nav>
    </header>
  )
}

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef(null)

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.length < 1) { setSuggestions([]); setShowSuggestions(false); return }
    try {
      const res = await fetch(`http://localhost:5000/movies/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.success) { setSuggestions(data.results); setShowSuggestions(data.results.length > 0) }
    } catch { }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setActiveIndex(-1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      setShowSuggestions(false); onSearch(query.trim())
    }
  }

  const handleSuggestionClick = (title) => {
    setQuery(title); setShowSuggestions(false); onSearch(title)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(prev => Math.max(prev - 1, -1)) }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSuggestionClick(suggestions[activeIndex].title) }
    else if (e.key === 'Escape') { setShowSuggestions(false) }
  }

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="search-section" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <div className="search-wrapper">
          <div className="search-icon">🔍</div>
          <input type="text" className="search-input" placeholder="Search for a movie... (e.g., Inception)" value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} autoComplete="off" />
          <button type="submit" className="search-btn" disabled={isLoading || !query.trim()}>
            <span className="btn-icon">✨</span> {isLoading ? 'Analyzing...' : 'Recommend'}
          </button>
        </div>
      </form>
      {showSuggestions && (
        <div className="autocomplete-dropdown">
          {suggestions.map((movie, index) => (
            <div key={movie.id} className={`autocomplete-item ${index === activeIndex ? 'active' : ''}`} onClick={() => handleSuggestionClick(movie.title)}>
              <span className="movie-icon">{getGenreIcon(movie.genre)}</span>
              <div className="movie-info">
                <div className="movie-name">{movie.title}</div>
                <div className="movie-meta">{movie.genre} • {movie.year}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MovieCard({ movie, rank, toggleFavorite, isFavorite, onClick }) {
  const gradient = getCardGradient(movie.genre)
  const icon = getGenreIcon(movie.genre)
  const genres = movie.genre ? movie.genre.split(',').map(g => g.trim()) : []

  const [posterUrl, setPosterUrl] = useState(null)
  useEffect(() => {
    if (!movie.id) return
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`)
      .then(r => r.json())
      .then(data => { if (data.poster_path) setPosterUrl(`https://image.tmdb.org/t/p/w500${data.poster_path}`) })
      .catch(() => { })
  }, [movie.id])

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="card-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="real-poster-img" />
        ) : (
          <div className="card-poster-gradient" style={{ background: gradient }}>
            <span style={{ position: 'relative', zIndex: 1 }}>{icon}</span>
          </div>
        )}

        {rank && <div className="card-rank">#{rank}</div>}

        <button className={`fav-badge-btn ${isFavorite ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}>
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {movie.match_percentage && (
          <div className="card-similarity">
            ⚡ {movie.match_percentage}% Match
          </div>
        )}
      </div>

      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <div className="card-genre">
          {genres.slice(0, 3).map((genre, i) => (
            <span key={i} className="genre-tag">{genre}</span>
          ))}
        </div>
        <div className="card-meta">
          <span className="card-rating">⭐ {movie.rating}</span>
          <span className="card-year">{movie.year}</span>
        </div>
        {movie.explainability && (
          <p className="card-explainability">{movie.explainability}</p>
        )}
      </div>
    </div>
  )
}

function TrendingRow({ onSearch, favorites, toggleFavorite }) {
  const [trending, setTrending] = useState([])
  useEffect(() => {
    fetch('http://localhost:5000/trending')
      .then(r => r.json())
      .then(d => { if (d.success) setTrending(d.results) })
      .catch(() => { })
  }, [])

  if (trending.length === 0) return null;

  return (
    <div className="trending-section">
      <div className="results-header" style={{ marginBottom: '16px' }}>
        <h2 className="results-title">🔥 Trending Now</h2>
      </div>
      <div className="movies-row">
        {trending.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            rank={index + 1}
            toggleFavorite={toggleFavorite} 
            isFavorite={favorites.some(f => f.id === movie.id)} 
            onClick={() => onSearch(movie.title)}
          />
        ))}
      </div>
    </div>
  )
}

function HeroParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`, opacity: Math.random() * 0.3 + 0.1, size: Math.random() * 3 + 1,
  }))
  return (
    <div className="hero-particles">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, opacity: p.opacity, width: `${p.size}px`, height: `${p.size}px` }} />
      ))}
    </div>
  )
}

function App() {
  const [recommendations, setRecommendations] = useState([])
  const [searchedMovie, setSearchedMovie] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cinematch_old_ui_favs') || '[]') } catch { return [] }
  })

  const resultsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    localStorage.setItem('cinematch_old_ui_favs', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (m) => {
    setFavorites(prev => prev.find(x => x.id === m.id) ? prev.filter(x => x.id !== m.id) : [...prev, m])
  }

  const handleSearch = async (movieTitle) => {
    setIsLoading(true); setError(null); setRecommendations([]); setSearchedMovie(movieTitle)
    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: movieTitle })
      })
      const data = await response.json()
      if (data.success) {
        setRecommendations(data.recommendations)
        setSearchedMovie(data.movie)
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
      } else {
        setError(data.error)
      }
    } catch {
      setError('Unable to connect to the recommendation server.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <Header scrolled={scrolled} />

      <section className="hero">
        <div className="hero-bg"><img src="/hero_bg.png" alt="" aria-hidden="true" /></div>
        <HeroParticles />
        <div className="hero-content">
          <div className="hero-badge">✨ Smart Recommendations</div>
          <h1 className="hero-title">Discover Your Next<br /><span className="highlight">Favorite Movie</span></h1>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      <TrendingRow onSearch={handleSearch} favorites={favorites} toggleFavorite={toggleFavorite} />

      <div ref={resultsRef}>
        {(isLoading || recommendations.length > 0 || error || favorites.length > 0) && (
          <section className="results-section">

            {isLoading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Analyzing movie patterns...</div>
                <div className="loading-dots"><span></span><span></span><span></span></div>
              </div>
            )}

            {!isLoading && error && (
              <div className="error-container">
                <div className="error-icon">🎬</div>
                <h3 className="error-title">Movie Not Found</h3>
                <p className="error-message">{error}</p>
              </div>
            )}

            {!isLoading && !error && recommendations.length > 0 && (
              <>
                <div className="results-header">
                  <h2 className="results-title">Because you liked <span className="query-highlight">"{searchedMovie}"</span></h2>
                  <span className="results-count">{recommendations.length} matches found</span>
                </div>
                <div className="movies-row">
                  {recommendations.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} rank={index + 1} toggleFavorite={toggleFavorite} isFavorite={favorites.some(f => f.id === movie.id)} onClick={() => handleSearch(movie.title)} />
                  ))}
                </div>
              </>
            )}

            {favorites.length > 0 && (
              <div style={{ marginTop: '50px' }}>
                <div className="results-header">
                  <h2 className="results-title"><span className="query-highlight">Your Favorites</span></h2>
                </div>
                <div className="movies-row">
                  {favorites.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} toggleFavorite={toggleFavorite} isFavorite={true} onClick={() => handleSearch(movie.title)} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

    </div>
  )
}

export default App
