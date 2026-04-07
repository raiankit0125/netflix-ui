import { useState } from 'react';

function SignInPage({ onGuestSignIn, onSignIn }) {
  const [name, setName] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      onGuestSignIn();
      return;
    }

    onSignIn(trimmedName);
  }

  return (
    <main className="signin-page">
      <section className="signin-card screen-panel">
        <p className="eyebrow">Short-form media app</p>
        <h1>Welcome back</h1>
        <p className="signin-copy">
          Sign in to browse TV shows, movies and video games from the IMDb API storefront.
        </p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <label className="signin-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="signin-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className="signin-actions">
            <button type="submit" className="primary-button">
              Sign In
            </button>
            <button type="button" className="secondary-button" onClick={onGuestSignIn}>
              Continue as Guest
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default SignInPage;
