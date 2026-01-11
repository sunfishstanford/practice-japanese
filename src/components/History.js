import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      // Reverse to show most recent first
      setHistory(parsedHistory.reverse());
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getAverageScore = () => {
    if (history.length === 0) return 0;
    const total = history.reduce((sum, session) => sum + session.percentage, 0);
    return Math.round(total / history.length);
  };

  const getTotalQuestions = () => {
    return history.reduce((sum, session) => sum + session.total, 0);
  };

  const getTotalCorrect = () => {
    return history.reduce((sum, session) => sum + session.score, 0);
  };

  return (
    <div className="history-container">
      <h2>Quiz History</h2>

      {history.length === 0 ? (
        <div className="no-history">
          <p>No quiz history yet. Complete a quiz session to see your scores here!</p>
        </div>
      ) : (
        <>
          <div className="history-stats">
            <div className="stat-card">
              <div className="stat-value">{history.length}</div>
              <div className="stat-label">Sessions Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{getAverageScore()}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {getTotalCorrect()} / {getTotalQuestions()}
              </div>
              <div className="stat-label">Total Correct</div>
            </div>
          </div>

          <div className="history-list">
            <h3>Session History</h3>
            {history.map((session, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{formatDate(session.date)}</div>
                <div className="history-score">
                  <span className="score-fraction">
                    {session.score} / {session.total}
                  </span>
                  <span
                    className={`score-percentage ${
                      session.percentage >= 80
                        ? 'excellent'
                        : session.percentage >= 60
                        ? 'good'
                        : 'needs-practice'
                    }`}
                  >
                    {session.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default History;
