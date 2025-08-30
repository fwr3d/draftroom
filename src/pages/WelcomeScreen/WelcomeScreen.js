import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <img src="/background.png" alt="Background" className="background-image" />
      <div className="welcome-content">
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Welcome to DraftRoom!</h1>
        <button 
          className="btn btn-primary start-btn" 
          onClick={() => navigate('/hub')}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
