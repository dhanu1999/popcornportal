import { useState } from 'react';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const [sources, setSources] = useState(null);
  const [loadingSources, setLoadingSources] = useState(false);
  const [error, setError] = useState(null);
  const [showAllSources, setShowAllSources] = useState(false);

  const fetchSources = async () => {
    if (sources) return;
    setLoadingSources(true);
    setError(null);
    try {
      const res = await fetch(`/api/sources?id=${movie.id}`);
      const data = await res.json();
      
      if (data.sources && data.sources.length > 0) {
        // Filter unique platforms to avoid duplicate entries for the same service
        const unique = data.sources.reduce((acc, current) => {
          if (!acc.find(item => item.name === current.name)) {
            return acc.concat([current]);
          }
          return acc;
        }, []).sort((a, b) => {
          // Prioritize Subscriptions (sub) over Free/Buy/Rent
          if (a.type === 'sub' && b.type !== 'sub') return -1;
          if (b.type === 'sub' && a.type !== 'sub') return 1;
          return 0;
        });
        setSources(unique);
      } else {
        setSources([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load platforms");
    } finally {
      setLoadingSources(false);
    }
  };

  return (
    <div className="movie-card glass-panel animate-fade-in">
      <div className="poster-container" onClick={fetchSources}>
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} className="poster-image" />
        ) : (
          <div className="poster-placeholder">No Image</div>
        )}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>
        
        <div className="sources-container">
          {!sources && !loadingSources && !error && (
            <button className="check-btn" onClick={fetchSources}>
              Where to Watch
            </button>
          )}
          
          {loadingSources && <p className="loading-text">Locating streams...</p>}
          {error && <p className="error-text">{error}</p>}
          {sources && sources.length === 0 && <p className="no-sources">Not streaming anywhere yet.</p>}
          
          {sources && sources.length > 0 && (
            <div className="platform-badges">
              {(showAllSources ? sources : sources.slice(0, 4)).map(source => (
                <a 
                  key={source.source_id} 
                  href={source.web_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="badge" 
                  title={`${source.name} (${source.type})`}
                >
                  {source.type === 'sub' ? '⭐ ' : ''}{source.name}
                </a>
              ))}
              {!showAllSources && sources.length > 4 && (
                <span 
                  className="more-badge" 
                  onClick={(e) => { e.stopPropagation(); setShowAllSources(true); }}
                  title="Show all platforms"
                >
                  +{sources.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
