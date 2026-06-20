import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './pages/Login';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#login');

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#login';
    }

    const handleHashChange = () => {
      setRoute(window.location.hash || '#login');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="App">
      {route === '#register' ? (
        <Register />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
