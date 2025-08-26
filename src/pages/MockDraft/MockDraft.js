import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './MockDraft.css';

const MockDraft = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teams = parseInt(searchParams.get('teams')) || 8;
  
  // Built-in player data
  const [allPlayers] = useState([
    { id: 1, name: "Christian McCaffrey", position: "RB", team: "SF" },
    { id: 2, name: "Tyreek Hill", position: "WR", team: "MIA" },
    { id: 3, name: "Austin Ekeler", position: "RB", team: "LAC" },
    { id: 4, name: "Stefon Diggs", position: "WR", team: "BUF" },
    { id: 5, name: "Saquon Barkley", position: "RB", team: "PHI" },
    { id: 6, name: "Davante Adams", position: "WR", team: "LV" },
    { id: 7, name: "Derrick Henry", position: "RB", team: "BAL" },
    { id: 8, name: "A.J. Brown", position: "WR", team: "PHI" },
    { id: 9, name: "Josh Jacobs", position: "RB", team: "GB" },
    { id: 10, name: "CeeDee Lamb", position: "WR", team: "DAL" },
    { id: 11, name: "Patrick Mahomes", position: "QB", team: "KC" },
    { id: 12, name: "Travis Kelce", position: "TE", team: "KC" },
    { id: 13, name: "Alvin Kamara", position: "RB", team: "NO" },
    { id: 14, name: "Deebo Samuel", position: "WR", team: "SF" },
    { id: 15, name: "Nick Chubb", position: "RB", team: "CLE" },
    { id: 16, name: "Mike Evans", position: "WR", team: "TB" },
    { id: 17, name: "Jalen Hurts", position: "QB", team: "PHI" },
    { id: 18, name: "Mark Andrews", position: "TE", team: "BAL" },
    { id: 19, name: "Joe Mixon", position: "RB", team: "CIN" },
    { id: 20, name: "DK Metcalf", position: "WR", team: "SEA" },
    { id: 21, name: "Lamar Jackson", position: "QB", team: "BAL" },
    { id: 22, name: "George Kittle", position: "TE", team: "SF" },
    { id: 23, name: "Rachaad White", position: "RB", team: "TB" },
    { id: 24, name: "Chris Olave", position: "WR", team: "NO" },
    { id: 25, name: "Justin Herbert", position: "QB", team: "LAC" }
  ]);

  const [availablePlayers, setAvailablePlayers] = useState([...allPlayers]);
  const [draftBoard, setDraftBoard] = useState([]);
  const [currentPick, setCurrentPick] = useState(1);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;

  // Calculate which team's turn it is
  const getCurrentTeam = (pickNumber) => {
    const round = Math.ceil(pickNumber / teams);
    const isSnakeRound = round % 2 === 0;
    
    if (isSnakeRound) {
      return teams - ((pickNumber - 1) % teams);
    } else {
      return ((pickNumber - 1) % teams) + 1;
    }
  };

  // Filter players based on search and position
  const filteredPlayers = availablePlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'ALL' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

  // Handle drafting a player
  const handleDraftPlayer = (player) => {
    if (currentTeam !== 1) {
      alert("It's not your turn yet!");
      return;
    }

    const newDraftBoard = [...draftBoard, {
      pick: currentPick,
      team: currentTeam,
      player: player,
      round: Math.ceil(currentPick / teams)
    }];

    setDraftBoard(newDraftBoard);
    setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
    setCurrentPick(currentPick + 1);
    setCurrentTeam(getCurrentTeam(currentPick + 1));
    setCurrentPage(1); // Reset to first page after drafting
  };

  // Reset filters when they change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, positionFilter]);

  const handleGoBack = () => {
    navigate('/Menu');
  };

  const isUserTurn = currentTeam === 1;

  return (
    <div className="mock-draft">
      <div className="container">
        <div className="draft-header">
          <button className="btn btn-secondary back-btn" onClick={handleGoBack}>
            ← Back to Hub
          </button>
          <div className="draft-info">
            <h1>Mock Draft - {teams} Teams</h1>
            <div className="turn-indicator">
              <span className="turn-label">Current Pick:</span>
              <span className={`turn-team ${isUserTurn ? 'user-turn' : ''}`}>
                Team {currentTeam} (Pick #{currentPick})
              </span>
            </div>
          </div>
        </div>

        <div className="draft-content grid grid-2">
          {/* Draft Board */}
          <div className="draft-board card">
            <h2>Draft Board</h2>
            <div className="board-content">
              {draftBoard.length === 0 ? (
                <p className="empty-board">No picks made yet. Start drafting!</p>
              ) : (
                <div className="picks-list">
                  {draftBoard.map((pick) => (
                    <div key={pick.pick} className={`pick-item ${pick.team === 1 ? 'user-pick' : ''}`}>
                      <div className="pick-header">
                        <span className="pick-number">#{pick.pick}</span>
                        <span className="pick-team">Team {pick.team}</span>
                        <span className="pick-round">R{pick.round}</span>
                      </div>
                      <div className="pick-player">
                        <span className="player-name">{pick.player.name}</span>
                        <span className="player-details">
                          {pick.player.position} • {pick.player.team}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Player Selection */}
          <div className="player-selection card">
            <h2>Available Players</h2>
            
            {/* Search and Filters */}
            <div className="search-filters">
              <input
                type="text"
                placeholder="Search players..."
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
              </select>
            </div>

            {/* Players List */}
            <div className="players-list">
              {currentPlayers.map((player) => (
                <div key={player.id} className="player-item">
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    <span className="player-details">
                      {player.position} • {player.team}
                    </span>
                  </div>
                  <button
                    className={`btn ${isUserTurn ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleDraftPlayer(player)}
                    disabled={!isUserTurn}
                  >
                    {isUserTurn ? 'Draft' : 'Not your turn'}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="results-count">
              Showing {filteredPlayers.length} of {availablePlayers.length} available players
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDraft;
