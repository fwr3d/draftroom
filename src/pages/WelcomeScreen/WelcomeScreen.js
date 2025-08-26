import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleEnterDraft = () => {
    navigate('/Menu');
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <div className="welcome-content glass fade-in">
          <div className="welcome-header">
            <h1 className="welcome-title">
              🏈 Fantasy Football Mock Draft
            </h1>
            <p className="welcome-subtitle">
              Experience the thrill of draft day with our interactive mock draft simulator
            </p>
          </div>
          
          <div className="welcome-features">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Snake Draft Format</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Smart Player Filtering</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Real-time Draft Board</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📱</span>
              <span>Responsive Design</span>
            </div>
          </div>

          <button 
            className="btn btn-primary enter-draft-btn"
            onClick={handleEnterDraft}
          >
            🚪 Enter Draft Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
