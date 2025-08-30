import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Players } from '../../data/Players.js';
import { playerPositionRanks, overallPlayerRankings } from '../../data/playerPositionRanks.js';
import './PlayerHub.css';

function PlayerHub() {
  const navigate = useNavigate();
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('overall');
  const playersPerPage = 20;

  useEffect(() => {
    // Flatten Players data and assign rankings
    const flattened = [];
    Players.forEach(positionGroup => {
      Object.values(positionGroup).forEach(players => {
        if (Array.isArray(players)) {
          players.forEach(player => {
            // Skip players without required fields (safety check)
            if (!player.id || !player.name || !player.position) {
              return;
            }
            
            // Skip DST players - they should only appear in the draft
            if (player.position === 'DST') {
              return;
            }
            
            // Assign ranking based on playerPositionRanks and overall rankings
            const positionRanks = playerPositionRanks[player.position];
            let playerRank = 999; // Default rank for unranked players
            let overallRank = 999; // Default overall rank
            
            // Check overall rankings first
            const overallIndex = overallPlayerRankings.indexOf(player.id);
            if (overallIndex !== -1) {
              overallRank = overallIndex + 1; // +1 because array is 0-indexed
            }
            
            if (positionRanks) {
              // Find which tier the player belongs to
              for (const [tierName, tierPlayers] of Object.entries(positionRanks)) {
                if (tierPlayers.includes(player.id)) {
                  // Extract tier number and assign rank
                  const tierNum = parseInt(tierName.split(' ')[1]);
                  const tierIndex = tierPlayers.indexOf(player.id);
                  playerRank = (tierNum * 100) + tierIndex; // Lower number = better rank
                  break;
                }
              }
            }
            
            // Add ranking to player object
            const playerWithRank = { ...player, rank: playerRank, overallRank: overallRank };
            flattened.push(playerWithRank);
          });
        }
      });
    });
    
    console.log('Total players loaded:', flattened.length);
    console.log('Players by position:', flattened.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {}));
    
    setAllPlayers(flattened);
    setFilteredPlayers(flattened);
  }, []);

  useEffect(() => {
    // Filter players based on search and position
    const filtered = allPlayers.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === 'ALL' || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    });

    // Sort players based on position filter
    let sorted;
    if (positionFilter === 'ALL') {
      // Use overall rankings when showing all positions
      sorted = [...filtered].sort((a, b) => {
        return (a.overallRank || 999) - (b.overallRank || 999); // Lower overall rank = better
      });
    } else {
      // Use position-specific rankings when filtering by position
      sorted = [...filtered].sort((a, b) => {
        return (a.rank || 999) - (b.rank || 999); // Lower position rank = better
      });
    }

    console.log('Filtered players:', filtered.length);
    console.log('Position filter:', positionFilter);
    console.log('Sorting by:', positionFilter === 'ALL' ? 'overall rankings' : 'position rankings');
    console.log('Players by position after filter:', filtered.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {}));

    setFilteredPlayers(sorted);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, positionFilter, allPlayers]);

  const goToPage = (pageNum) => {
    if (pageNum === 'prev') {
      pageNum = currentPage - 1;
    } else if (pageNum === 'next') {
      pageNum = currentPage + 1;
    }

    if (pageNum < 1 || pageNum > Math.ceil(filteredPlayers.length / playersPerPage)) {
      return;
    }
    setCurrentPage(pageNum);
  };

  const getTeamLogo = (team) => {
    // Map team abbreviations to logo files
    const teamLogoMap = {
      'ARI': '/team-logos/ARI.webp',
      'ATL': '/team-logos/ATL.webp',
      'BAL': '/team-logos/BAL.webp',
      'BUF': '/team-logos/BUF.webp',
      'CAR': '/team-logos/CAR.webp',
      'CHI': '/team-logos/CHI.webp',
      'CIN': '/team-logos/CIN.webp',
      'CLE': '/team-logos/CLE.webp',
      'DAL': '/team-logos/DAL.webp',
      'DEN': '/team-logos/DEN.webp',
      'DET': '/team-logos/DET.webp',
      'GB': '/team-logos/GB.webp',
      'HOU': '/team-logos/HOU.webp',
      'IND': '/team-logos/IND.webp',
      'JAX': '/team-logos/JAX.webp',
      'KC': '/team-logos/KC.webp',
      'LAC': '/team-logos/LAC.webp',
      'LAR': '/team-logos/LAR.webp',
      'LV': '/team-logos/LV.webp',
      'MIA': '/team-logos/MIA.webp',
      'MIN': '/team-logos/MIN.webp',
      'NE': '/team-logos/NE.webp',
      'NO': '/team-logos/NO.webp',
      'NYG': '/team-logos/NYG.webp',
      'NYJ': '/team-logos/NYJ.webp',
      'PHI': '/team-logos/PHI.webp',
      'PIT': '/team-logos/PIT.webp',
      'SEA': '/team-logos/SEA.webp',
      'SF': '/team-logos/SF.webp',
      'TB': '/team-logos/TB.webp',
      'TEN': '/team-logos/TEN.webp',
      'WAS': '/team-logos/WAS.webp'
    };
    return teamLogoMap[team] || '/team-logos/ARI.webp'; // Default fallback
  };

  const getPlayerImage = (playerId) => {
    // Try to find a player image by ID, fallback to a default
    return `/player-images/${playerId}.png`;
  };

  const renderPlayersPage = () => {
    const startIndex = (currentPage - 1) * playersPerPage;
    const endIndex = startIndex + playersPerPage;
    const pagePlayers = filteredPlayers.slice(startIndex, endIndex);

    return pagePlayers.map(player => (
      <div key={player.id} className="player-card">
        <div className="player-card-header">
          <div className="player-image-section">
            <img 
              src={getPlayerImage(player.id)} 
              alt={player.name}
              className="player-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          </div>
          
          <div className="player-main-info">
            <div className="player-name">{player.name}</div>
            <div className="player-position">{player.position}</div>
          </div>
        </div>

        <div className="team-logo-section">
          <img 
            src={getTeamLogo(player.team)} 
            alt={`${player.team} logo`}
            className="team-logo"
          />
        </div>

        <div className="player-card-body">
        </div>
      </div>
    ));
  };

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  return (
    <div className="player-hub">
      <div className="container">
        <div className="hub-header">
          <button className="btn btn-secondary back-btn" onClick={() => navigate('/')}>
            ← Back to Welcome
          </button>
          <h1 className="hub-title">Player Hub</h1>
          <p className="hub-subtitle">Browse and search all available players</p>
        </div>
        
        <div className="hub-content">
          <div className="search-section glass">
            <h2>Search & Filter Players</h2>
            <div className="search-filters">
              <input 
                type="text" 
                placeholder="Search players by name..." 
                className="form-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
                             <select 
                 className="form-select" 
                 value={positionFilter}
                 onChange={(e) => setPositionFilter(e.target.value)}
               >
                 <option value="ALL">All Positions</option>
                 <option value="QB">Quarterbacks</option>
                 <option value="RB">Running Backs</option>
                 <option value="WR">Wide Receivers</option>
                 <option value="TE">Tight Ends</option>
                 <option value="K">Kickers</option>
               </select>
            </div>
            <div className="results-count">
              Showing {Math.min((currentPage - 1) * playersPerPage + 1, filteredPlayers.length)}-
              {Math.min(currentPage * playersPerPage, filteredPlayers.length)} of {filteredPlayers.length} players
            </div>
          </div>
          
          <div className="players-grid">
            {renderPlayersPage()}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-section glass">
              <div className="pagination-info">
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              <div className="pagination-controls">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => goToPage('prev')} 
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      className={`btn btn-secondary page-btn ${currentPage === page ? 'active' : ''}`} 
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => goToPage('next')} 
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
          
          <div className="action-section">
            <button className="btn btn-primary start-draft-btn" onClick={() => navigate('/draft')}>
              Start Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerHub;
