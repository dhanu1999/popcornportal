import { useState } from 'react'
import SearchBar from './components/SearchBar'
import MovieCard from './components/MovieCard'
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setMovies([]);
    
    try {
      const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
      // Using autocomplete-search endpoint to securely fetch title poster images 
      const res = await fetch(`https://api.watchmode.com/v1/autocomplete-search/?apiKey=${API_KEY}&search_value=${encodeURIComponent(query)}&search_type=1`);
      const data = await res.json();
      
      if (data.results) {
        const parsedMovies = data.results.map(item => ({
          id: item.id,
          title: item.name,
          year: item.year,
          poster: item.image_url
        }));
        setMovies(parsedMovies);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch movies. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="hero-section">
        <h1 
          className="text-gradient animate-float" 
          onClick={goHome} 
          style={{ cursor: 'pointer', display: 'inline-block' }} 
          title="Return to Home"
        >
          PopcornPortal
        </h1>
        <p className="subtitle">Discover where to stream any movie instantly.</p>
        
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          onSearch={handleSearch} 
          isLoading={isLoading} 
        />
      </header>
      
      <main className="main-content">
        {movies && movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state text-muted animate-fade-in">
            {isLoading ? "Searching the multiverse..." : (hasSearched ? "No titles found. Try another search." : "Your next favorite movie is just a search away.")}
          </div>
        )}
      </main>
      
      <footer className="glass-panel disclaimer">
        <p>
          Streaming data powered by <a href="https://www.watchmode.com/" target="_blank" rel="noopener noreferrer">Watchmode.com</a>. 
          We do not host any content. Availability may vary by region.
        </p>
      </footer>
    </div>
  )
}

export default App
