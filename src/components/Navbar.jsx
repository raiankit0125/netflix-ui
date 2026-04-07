function Navbar({ tabs, activeTab, onTabChange, userName, onSignOut, onOpenProfile }) {
  return (
    <header className="navbar">
      <div className="brand-block">
        <span className="brand-logo">NETFLIX</span>
        <span className="brand-subtitle">desktop storefront</span>
      </div>

      <nav className="tab-list" aria-label="Media filters">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'tab-button active' : 'tab-button'}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="account-bar">
        <button type="button" className="secondary-button compact-button" onClick={onOpenProfile}>
          Profile
        </button>
        <span className="user-chip">Hi, {userName}</span>
        <button type="button" className="secondary-button compact-button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
