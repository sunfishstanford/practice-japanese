import React, { useState, useEffect } from 'react';
import './App.css';
import Quiz from './components/Quiz';
import Settings from './components/Settings';
import History from './components/History';

function App() {
  const [currentPage, setCurrentPage] = useState('quiz');
  const [settings, setSettings] = useState({
    questionsPerSession: 10,
    showRomaji: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('quizSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('quizSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Practice Japanese</h1>
      </header>

      <nav className="App-nav">
        <button
          className={currentPage === 'quiz' ? 'active' : ''}
          onClick={() => setCurrentPage('quiz')}
        >
          Quiz
        </button>
        <button
          className={currentPage === 'settings' ? 'active' : ''}
          onClick={() => setCurrentPage('settings')}
        >
          Settings
        </button>
        <button
          className={currentPage === 'history' ? 'active' : ''}
          onClick={() => setCurrentPage('history')}
        >
          History
        </button>
      </nav>

      <main className="App-main">
        {currentPage === 'quiz' && <Quiz settings={settings} />}
        {currentPage === 'settings' && (
          <Settings settings={settings} updateSettings={updateSettings} />
        )}
        {currentPage === 'history' && <History />}
      </main>
    </div>
  );
}

export default App;
