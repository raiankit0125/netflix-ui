function MoviePreviewPage({ user, item, watchlist, onBack, onOpenProfile, onToggleWatchlist, onSignOut }) {
  const isSaved = watchlist.some((entry) => entry.id === item.id);
  const backdrop = item.image || 'https://placehold.co/1200x700/1d1d1d/ededed?text=Preview';

  return (
    <main className="page-shell">
      <section className="preview-hero screen-panel" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 15, 15, 0.95), rgba(15, 15, 15, 0.55), rgba(15, 15, 15, 0.25)), url(${backdrop})` }}>
        <div className="preview-topbar">
          <button type="button" className="secondary-button" onClick={onBack}>Back</button>
          <div className="profile-actions">
            <button type="button" className="secondary-button" onClick={onOpenProfile}>Profile</button>
            <span className="user-chip">Hi, {user.name}</span>
            <button type="button" className="secondary-button" onClick={onSignOut}>Sign out</button>
          </div>
        </div>

        <div className="preview-content">
          <p className="eyebrow">Movie preview</p>
          <h1>{item.title}</h1>
          <div className="meta-row">
            <span>{item.categoryLabel}</span>
            <span>{item.year || 'N/A'}</span>
            <span>{item.rating ? `${item.rating}/10` : 'Unrated'}</span>
            <span>{item.id}</span>
          </div>
          <p className="preview-plot">{item.plot || 'Plot is not available for this title.'}</p>
          <p className="hero-genres">{item.genres?.join(' | ') || 'Genre not available'}</p>

          <div className="preview-actions">
            <button type="button" className="primary-button" onClick={() => onToggleWatchlist(item)}>
              {isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
            <button type="button" className="secondary-button" onClick={onOpenProfile}>Open Profile</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MoviePreviewPage;
