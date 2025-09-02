import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';
import backgroundImage from '../../public/background.png';

function WelcomeScreen() {
  const navigate = useNavigate();
  
  console.log('WelcomeScreen rendering');

  return (
    <div className="welcome-screen">
      <img 
        src={backgroundImage}
        alt="Background" 
        className="background-image"
        onLoad={() => console.log('Background image loaded successfully')}
        onError={(e) => {
          console.log('Background image failed to load:', e.target.src);
          e.target.style.display = 'none';
        }}
      />
      <div className="welcome-content">
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Welcome to DraftRoom!</h1>
        <button 
          className="btn btn-primary start-btn" 
          onClick={() => {
            console.log('Start button clicked');
            navigate('/hub');
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
