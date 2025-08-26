import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerHub.css';

const PlayerHub = () => {
  const navigate = useNavigate();
  const [leagueSize, setLeagueSize] = useState(8);

  const handleStartDraft = () => {
    navigate(`/draft?teams=${leagueSize}`);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="player-hub">
      <div className="container">
        <div className="hub-header">
          <button className="btn btn-secondary back-btn" onClick={handleGoBack}>
            ← Back to Welcome
          </button>
          <h1 className="hub-title">🏈 Player Hub</h1>
          <p className="hub-subtitle">Configure your league and start drafting</p>
        </div>

        <div className="hub-content">
          <div className="setup-card glass">
            <h2 className="setup-title">League Configuration</h2>
            
            <div className="form-group">
              <label className="form-label">Number of Teams</label>
              <select 
                className="form-select"
                value={leagueSize}
                onChange={(e) => setLeagueSize(Number(e.target.value))}
              >
                <option value={6}>6 Teams</option>
                <option value={8}>8 Teams</option>
                <option value={10}>10 Teams</option>
                <option value={12}>12 Teams</option>
                <option value={14}>14 Teams</option>
              </select>
            </div>

            <div className="draft-info">
              <h3>Draft Format</h3>
              <ul>
                <li>Snake Draft (1→2→3→4→4→3→2→1)</li>
                <li>You control Team 1 (first pick)</li>
                <li>Standard fantasy football positions</li>
                <li>Real-time draft board updates</li>
              </ul>
            </div>

            <button 
              className="btn btn-primary start-draft-btn"
              onClick={handleStartDraft}
            >
              🚀 Start Mock Draft
            </button>
          </div>

          <div className="info-card glass">
            <h3>How It Works</h3>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <div>
                <h4>Select Players</h4>
                <p>Choose from available players when it's your turn</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📊</span>
              <div>
                <h4>Track Progress</h4>
                <p>Monitor your team and the overall draft board</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🔍</span>
              <div>
                <h4>Smart Filtering</h4>
                <p>Search and filter players by name and position</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHub;
