import MediaGrid from '../components/MediaGrid';

function ProfilePage({ user, watchHistory, watchlist, onBack, onOpenPreview, onToggleWatchlist, onSignOut }) {
  return (
    <main className="page-shell">
      <section className="page-content screen-panel">
        <div className="profile-header screen-panel">
          <div>
            <p className="eyebrow">Profile view</p>
            <h1>{user.name}&apos;s profile</h1>
            <p className="toolbar-copy">See your watch history, saved watchlist and sign out from here.</p>
          </div>

          <div className="profile-actions">
            <button type="button" className="secondary-button" onClick={onBack}>Back to Home</button>
            <button type="button" className="secondary-button" onClick={onSignOut}>Sign out</button>
          </div>
        </div>

        <section className="summary-strip screen-panel">
          <article className="summary-card"><span className="summary-label">Watch history</span><strong>{watchHistory.length}</strong></article>
          <article className="summary-card"><span className="summary-label">Watchlist</span><strong>{watchlist.length}</strong></article>
          <article className="summary-card"><span className="summary-label">Account type</span><strong>{user.name === 'Guest' ? 'Guest' : 'Member'}</strong></article>
        </section>

        <section className="search-view screen-panel">
          <div className="section-heading">
            <div>
              <h2>Watch history</h2>
              <p>Recently opened previews are stored here.</p>
            </div>
          </div>
          <MediaGrid
            items={watchHistory}
            loading={false}
            emptyMessage="No watch history yet. Open a title preview to start tracking."
            onOpenItem={onOpenPreview}
            onToggleWatchlist={onToggleWatchlist}
            watchlist={watchlist}
          />
        </section>

        <section className="search-view screen-panel">
          <div className="section-heading">
            <div>
              <h2>Watchlist</h2>
              <p>Titles you saved to watch later.</p>
            </div>
          </div>
          <MediaGrid
            items={watchlist}
            loading={false}
            emptyMessage="Your watchlist is empty right now."
            onOpenItem={onOpenPreview}
            onToggleWatchlist={onToggleWatchlist}
            watchlist={watchlist}
          />
        </section>
      </section>
    </main>
  );
}

export default ProfilePage;
