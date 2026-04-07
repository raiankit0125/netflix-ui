import { useState } from 'react';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import './styles/app.css';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <SignInPage
        onGuestSignIn={() => setUser({ name: 'Guest' })}
        onSignIn={(name) => setUser({ name })}
      />
    );
  }

  return <HomePage user={user} onSignOut={() => setUser(null)} />;
}

export default App;
