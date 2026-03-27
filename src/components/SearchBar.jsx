export default function SearchBar({ query, setQuery, onSearch, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if(query.trim()) onSearch();
  };

  return (
    <form className="search-container glass-panel" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Search for a movie (e.g. Inception, Dune)..." 
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" className="search-button" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  )
}
