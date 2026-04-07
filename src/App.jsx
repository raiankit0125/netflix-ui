import { useState } from 'react';
import HomePage from './pages/HomePage';
import MoviePreviewPage from './pages/MoviePreviewPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import './styles/app.css';

function addUniqueItem(list, item) {
  const nextList = [item, ...list.filter((entry) => entry.id !== item.id)];
  return nextList.slice(0, 20);
}

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  function handleOpenPreview(item) {
    setSelectedItem(item);
    setScreen('preview');
    setWatchHistory((current) => addUniqueItem(current, item));
  }

  function handleToggleWatchlist(item) {
    setWatchlist((current) => {
      const exists = current.some((entry) => entry.id === item.id);

      if (exists) {
        return current.filter((entry) => entry.id !== item.id);
      }

      return addUniqueItem(current, item);
    });
  }

  function handleSignOut() {
    setUser(null);
    setScreen('home');
    setSelectedItem(null);
  }

  if (!user) {
    return (
      <SignInPage
        onGuestSignIn={() => setUser({ name: 'Guest' })}
        onSignIn={(name) => setUser({ name })}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <ProfilePage
        user={user}
        watchHistory={watchHistory}
        watchlist={watchlist}
        onBack={() => setScreen('home')}
        onOpenPreview={handleOpenPreview}
        onToggleWatchlist={handleToggleWatchlist}
        onSignOut={handleSignOut}
      />
    );
  }

  if (screen === 'preview' && selectedItem) {
    return (
      <MoviePreviewPage
        user={user}
        item={selectedItem}
        watchlist={watchlist}
        onBack={() => setScreen('home')}
        onOpenProfile={() => setScreen('profile')}
        onToggleWatchlist={handleToggleWatchlist}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <HomePage
      user={user}
      watchlist={watchlist}
      onSignOut={handleSignOut}
      onOpenProfile={() => setScreen('profile')}
      onOpenPreview={handleOpenPreview}
      onToggleWatchlist={handleToggleWatchlist}
    />
  );
}

export default App;
