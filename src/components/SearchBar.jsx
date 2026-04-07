import { useEffect, useRef, useState } from 'react';

function SearchBar({ value, onChange, suggestions, onSuggestionSelect }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const hasSuggestions = value.trim() && suggestions.length > 0 && showSuggestions;

  return (
    <div className="search-shell" ref={wrapperRef}>
      <input
        type="search"
        className="search-input"
        placeholder="Search by title, IMDb ID or year"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />

      {hasSuggestions ? (
        <div className="suggestions-panel" role="listbox" aria-label="Search suggestions">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className="suggestion-item"
              onClick={() => {
                onSuggestionSelect(item.title);
                setShowSuggestions(false);
              }}
            >
              <strong>{item.title}</strong>
              <span>
                {item.id} | {item.year || 'N/A'}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
