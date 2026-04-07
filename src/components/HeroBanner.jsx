function HeroBanner({ item, loading }) {
  if (loading) {
    return (
      <section className="hero-banner loading-banner screen-panel">
        <div className="hero-copy">
          <p className="eyebrow">Today&apos;s top show</p>
          <h2>Loading top title...</h2>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="hero-banner empty-banner screen-panel">
        <div className="hero-copy">
          <p className="eyebrow">Today&apos;s top show</p>
          <h2>No title matched your filter.</h2>
        </div>
      </section>
    );
  }

  const genres = item.genres?.slice(0, 3).join(' | ') || 'Genre not available';
  const backdrop = item.image || 'https://placehold.co/1200x600/1d1d1d/ededed?text=Top+Show';

  return (
    <section
      className="hero-banner screen-panel"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(16, 16, 16, 0.92), rgba(16, 16, 16, 0.55), rgba(16, 16, 16, 0.18)), url(${backdrop})`,
      }}
    >
      <div className="hero-copy">
        <p className="eyebrow">Today&apos;s top show</p>
        <h2>{item.title}</h2>
        <div className="meta-row">
          <span>{item.categoryLabel}</span>
          <span>{item.year || 'N/A'}</span>
          <span>{item.rating ? `${item.rating}/10` : 'Unrated'}</span>
        </div>
        <p className="hero-plot">{item.plot || 'Plot is not available for this title.'}</p>
        <p className="hero-genres">{genres}</p>
      </div>
    </section>
  );
}

export default HeroBanner;
