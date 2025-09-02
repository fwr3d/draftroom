import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Players } from '../../data/Players.js';
import { playerPositionRanks, overallPlayerRankings } from '../../data/playerPositionRanks.js';
import './MockDraft.css';

function MockDraft() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [draftState, setDraftState] = useState({
    currentPick: 1,
    currentRound: 1,
    currentTeam: 1,
    draftBoard: [],
    availablePlayers: [],
    teamRosters: {},
    isUserTurn: true,
    isDraftComplete: false
  });
  
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isRosterExpanded, setIsRosterExpanded] = useState(false);
  const [isDraftPaused, setIsDraftPaused] = useState(false);
  
  const teams = parseInt(searchParams.get('teams')) || 8;

  const handlePauseDraft = () => {
    setIsDraftPaused(!isDraftPaused);
    console.log('Draft', isDraftPaused ? 'resumed' : 'paused');
  };

  const handleRestartDraft = () => {
    // Re-initialize team rosters properly
    const teamRosters = {};
    for (let i = 1; i <= teams; i++) {
      teamRosters[i] = {
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        K: [],
        DEF: []
      };
    }
    
    setDraftState({
      currentPick: 1,
      currentRound: 1,
      currentTeam: 1,
      draftBoard: [],
      availablePlayers: [...allPlayers],
      teamRosters: teamRosters,
      isUserTurn: true,
      isDraftComplete: false
    });
    setIsDraftPaused(false);
    console.log('Draft restarted with', allPlayers.length, 'available players');
  };

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
    
    console.log('MockDraft - Total players loaded:', flattened.length);
    console.log('MockDraft - Players by position:', flattened.reduce((acc, player) => {
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

    // Sort players based on position filter (same logic as PlayerHub)
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

    console.log('MockDraft - Filtered players:', filtered.length);
    console.log('MockDraft - Position filter:', positionFilter);
    console.log('MockDraft - Sorting by:', positionFilter === 'ALL' ? 'overall rankings' : 'position rankings');
    
    setFilteredPlayers(sorted);
  }, [searchTerm, positionFilter, allPlayers]);

  // Initialize draft when players are loaded
  useEffect(() => {
    if (allPlayers.length > 0) {
      initializeDraft();
    }
  }, [allPlayers]);

  // Auto-trigger AI picks when it's not the user's turn
  useEffect(() => {
    if (!draftState.isUserTurn && !draftState.isDraftComplete && draftState.availablePlayers.length > 0 && !isDraftPaused) {
      const timer = setTimeout(() => {
        aiDraft();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [draftState.isUserTurn, draftState.isDraftComplete, draftState.availablePlayers.length, isDraftPaused]);

  // AI Draft Logic Functions
  const initializeDraft = () => {
    const teamRosters = {};
    for (let i = 1; i <= teams; i++) {
      teamRosters[i] = {
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        K: [],
        DST: []
      };
    }

    setDraftState(prev => ({
      ...prev,
      availablePlayers: [...allPlayers],
      teamRosters
    }));
  };

  const getPositionalNeed = (teamRoster, position) => {
    const roster = teamRoster[position] || [];
    const maxPlayers = {
      QB: 2,
      RB: 4,
      WR: 5,
      TE: 2,
      K: 1,
      DST: 1
    };
    return Math.max(0, maxPlayers[position] - roster.length);
  };

  const calculatePositionValue = (player, teamRoster, currentRound) => {
    const position = player.position;
    const need = getPositionalNeed(teamRoster, position);
    const overallRank = player.overallRank || 999;
    const positionRank = player.rank || 999;
    
    // Base value from rankings - prioritize position rankings for better positional strategy
    let value = (1000 - positionRank) * 15; // Increased weight for position rankings
    value += (1000 - overallRank) * 5; // Additional overall ranking consideration
    
    // Position scarcity bonus
    if (need > 0) {
      value += need * 100;
    }
    
    // Early round strategy (RB/WR priority)
    if (currentRound <= 4) {
      if (position === 'RB' || position === 'WR') {
        value += 200;
      }
    }
    
    // Late round strategy (QB/TE/K/DST priority)
    if (currentRound >= 8) {
      if (position === 'QB' || position === 'TE' || position === 'K' || position === 'DST') {
        value += 150;
      }
    }
    
    // Position-specific adjustments
    if (position === 'RB' && currentRound <= 6) value += 100;
    if (position === 'WR' && currentRound <= 7) value += 80;
    if (position === 'QB' && currentRound >= 5) value += 120;
    if (position === 'TE' && currentRound >= 6) value += 100;
    
    return value;
  };

  const aiDraft = () => {
    console.log('AI Draft called:', {
      isUserTurn: draftState.isUserTurn,
      isDraftComplete: draftState.isDraftComplete,
      currentTeam: draftState.currentTeam,
      availablePlayers: draftState.availablePlayers.length,
      positionFilter: positionFilter,
      isDraftPaused
    });

    if (draftState.isUserTurn || draftState.isDraftComplete || isDraftPaused) {
      console.log('AI Draft blocked:', { isUserTurn: draftState.isUserTurn, isDraftComplete: draftState.isDraftComplete, isDraftPaused });
      return;
    }

    const currentTeam = draftState.currentTeam;
    const teamRoster = draftState.teamRosters[currentTeam];
    const availablePlayers = draftState.availablePlayers;
    
    if (availablePlayers.length === 0) {
      console.log('No available players for AI');
      return;
    }

    // Calculate value for each available player
    const playerValues = availablePlayers.map(player => ({
      ...player,
      value: calculatePositionValue(player, teamRoster, draftState.currentRound)
    }));

    // Sort by value and pick the best available
    playerValues.sort((a, b) => b.value - a.value);
    const selectedPlayer = playerValues[0];

    // Execute the pick
    executePick(selectedPlayer, currentTeam);
  };

  const executePick = (player, teamNumber) => {
    const newDraftBoard = [...draftState.draftBoard];
    newDraftBoard.push({
      pick: draftState.currentPick,
      round: draftState.currentRound,
      team: teamNumber,
      player: player
    });

    const newTeamRosters = { ...draftState.teamRosters };
    
    // Safety check: ensure team roster exists and has the position
    if (!newTeamRosters[teamNumber]) {
      console.error('Team roster not found for team', teamNumber);
      return;
    }
    if (!newTeamRosters[teamNumber][player.position]) {
      console.error('Position not found for team', teamNumber, 'position', player.position);
      return;
    }
    
    newTeamRosters[teamNumber][player.position].push(player);

    const newAvailablePlayers = draftState.availablePlayers.filter(p => p.id !== player.id);

    const nextPick = draftState.currentPick + 1;
    const nextRound = Math.ceil(nextPick / teams);
    const nextTeam = nextPick % teams === 0 ? teams : nextPick % teams;
    const isUserTurn = nextTeam === 1; // User is always team 1

    console.log('ExecutePick - Next state:', {
      nextPick,
      nextRound,
      nextTeam,
      isUserTurn,
      availablePlayersCount: newAvailablePlayers.length
    });

    setDraftState(prev => ({
      ...prev,
      currentPick: nextPick,
      currentRound: nextRound,
      currentTeam: nextTeam,
      draftBoard: newDraftBoard,
      teamRosters: newTeamRosters,
      availablePlayers: newAvailablePlayers,
      isUserTurn,
      isDraftComplete: newAvailablePlayers.length === 0
    }));

    // Update filtered players for display (maintain sorting)
    const filtered = newAvailablePlayers.filter(player => {
      const matchesSearch = searchTerm.toLowerCase() === '' || player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === 'ALL' || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    });

    // Sort the filtered players based on current filter
    let sorted;
    if (positionFilter === 'ALL') {
      sorted = [...filtered].sort((a, b) => {
        return (a.overallRank || 999) - (b.overallRank || 999);
      });
    } else {
      sorted = [...filtered].sort((a, b) => {
        return (a.rank || 999) - (b.rank || 999);
      });
    }

    setFilteredPlayers(sorted);
  };

  const handleDraft = (player) => {
    console.log('handleDraft called:', { isUserTurn: draftState.isUserTurn, isDraftComplete: draftState.isDraftComplete, isDraftPaused });
    if (!draftState.isUserTurn || draftState.isDraftComplete || isDraftPaused) {
      console.log('Draft blocked:', { isUserTurn: draftState.isUserTurn, isDraftComplete: draftState.isDraftComplete, isDraftPaused });
      return;
    }
    
    executePick(player, 1); // User is team 1
    
    // AI pick will be automatically triggered by useEffect
  };

  return (
    <div className="mock-draft">
      <div className="container">
        <div className="draft-header">
          <button className="btn btn-secondary back-btn" onClick={() => navigate('/hub')}>
            ← Back to Player Hub
          </button>
          <div className="draft-info">
            <h1>DraftRoom - {teams} Teams</h1>
            <div className="turn-indicator">
              <span className="turn-label">Current Pick:</span>
              <span className={`turn-team ${draftState.isUserTurn ? 'user-turn' : ''}`}>
                {draftState.isUserTurn ? 'Your Turn' : `Team ${draftState.currentTeam}`} 
                (Pick #{draftState.currentPick})
              </span>
              {isDraftPaused && <span className="turn-team" style={{background: '#ff6b6b', marginLeft: '10px'}}>DRAFT PAUSED</span>}
            </div>
          </div>
        </div>
        
        <div className="draft-content">
          <div className="draft-main-section">
            <div className="draft-board-section">
              <div className="draft-board glass">
                <h2>Draft Board</h2>
                <div className="draft-rounds">
                  {/* only show the current round */}
                  {(() => {
                    const currentRound = draftState.currentRound;
                    const roundPicks = draftState.draftBoard.filter(pick => pick.round === currentRound);
                    
                    return (
                      <div className="draft-round current-round">
                        <h3>
                          Round {currentRound}
                          <span className="current-indicator"> (Current)</span>
                        </h3>
                        <div className="round-picks">
                          {Array.from({length: teams}, (_, teamIndex) => {
                            const teamNumber = teamIndex + 1;
                            const pick = roundPicks.find(p => p.team === teamNumber);
                            
                            return (
                              <div key={teamIndex} className="pick-slot">
                                <div className="team-label">Team {teamNumber}</div>
                                {pick ? (
                                  <div className="picked-player">
                                    <div className="player-name">{pick.player.name}</div>
                                    <div className="player-details">{pick.player.position} | {pick.player.team}</div>
                                  </div>
                                ) : (
                                  <div className="empty-slot">-</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              
              {/* draft history buttons - always show for testing */}
              {true && (
                <div className="button-container glass">
                  <div className="button-header">
                    <button 
                      className="history-link-btn"
                      onClick={() => {
                        console.log('View Picks clicked');
                        setIsHistoryExpanded(true);
                      }}
                    >
                      View Picks 
                    </button>
                    <button 
                      className="history-link-btn"
                      onClick={() => {
                        console.log('View Rosters clicked');
                        setIsRosterExpanded(true);
                      }}
                    >
                      View Rosters
                    </button>
                    <button 
                      className="history-link-btn"
                      onClick={handlePauseDraft}
                    >
                      {isDraftPaused ? 'Resume Draft' : 'Pause Draft'}
                    </button>
                    <button 
                      className="history-link-btn"
                      onClick={handleRestartDraft}
                    >
                      Restart Draft
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="player-selection glass">
              <h2>Available Players</h2>
              <div className="filters">
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
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="WR">WR</option>
                  <option value="TE">TE</option>
                  <option value="K">K</option>
                  <option value="DST">DST</option>
                </select>
              </div>
              
              <div className="player-list">
                {filteredPlayers.slice(0, 30).map(player => (
                  <div key={player.id} className="player-card">
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div className="player-details">
                        {player.position} | {player.team}
                      </div>
                    </div>
                    {draftState.isUserTurn && !draftState.isDraftComplete && (
                      <button 
                        className="btn btn-primary draft-btn" 
                        onClick={() => handleDraft(player)}
                      >
                        Draft
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* full screen overlay for draft history */}
          {isHistoryExpanded && (
            <div className="history-overlay">
              <div className="history-overlay-content">
                <div className="history-overlay-header">
                  <h2>Draft History - {teams} Teams</h2>
                  <button 
                    className="close-overlay-btn"
                    onClick={() => setIsHistoryExpanded(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="history-overlay-grid">
                  {Array.from({length: Math.ceil(draftState.draftBoard.length / teams)}, (_, roundIndex) => {
                    const round = roundIndex + 1;
                    const roundPicks = draftState.draftBoard.filter(pick => pick.round === round);
                    
                    return (
                      <div key={round} className="history-overlay-row" style={{ gridTemplateColumns: `repeat(${teams}, 1fr)` }}>
                        {Array.from({length: teams}, (_, teamIndex) => {
                          const teamNumber = teamIndex + 1;
                          const pick = roundPicks.find(p => p.team === teamNumber);
                          
                          return (
                            <div key={teamIndex} className="history-overlay-cell">
                              {pick ? (
                                <div className="history-overlay-player">
                                  <div className="history-overlay-player-name">{pick.player.name}</div>
                                  <div className="history-overlay-pick-number">{pick.round}.{(pick.pick % teams === 0 ? teams : pick.pick % teams).toString().padStart(2, '0')}</div>
                                </div>
                              ) : (
                                <div className="history-overlay-empty">-</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {/* full screen overlay for your roster */}
          {isRosterExpanded && (
            <div className="roster-overlay">
              <div className="roster-overlay-content">
                <div className="roster-overlay-header">
                  <h2>Your Team Roster</h2>
                  <button 
                    className="close-overlay-btn"
                    onClick={() => setIsRosterExpanded(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="roster-overlay-grid">
                  <div className="roster-overlay-row">
                    <h3>Team 1 (Your Team)</h3>
                    <div className="roster-overlay-positions">
                      <div className="position-group">
                        <h4>QB</h4>
                        <ul>
                          {draftState.teamRosters[1].QB.map(player => (
                            <li key={player.id}>{player.name} ({player.position})</li>
                          ))}
                        </ul>
                      </div>
                      <div className="position-group">
                        <h4>RB</h4>
                        <ul>
                          {draftState.teamRosters[1].RB.map(player => (
                            <li key={player.id}>{player.name} ({player.position})</li>
                          ))}
                        </ul>
                      </div>
                      <div className="position-group">
                        <h4>WR</h4>
                        <ul>
                          {draftState.teamRosters[1].WR.map(player => (
                            <li key={player.id}>{player.name} ({player.position})</li>
                          ))}
                        </ul>
                      </div>
                      <div className="position-group">
                        <h4>TE</h4>
                        <ul>
                          {draftState.teamRosters[1].TE.map(player => (
                            <li key={player.id}>{player.name} ({player.position})</li>
                          ))}
                        </ul>
                      </div>
                      <div className="position-group">
                        <h4>K</h4>
                        <ul>
                          {draftState.teamRosters[1].K.map(player => (
                            <li key={player.id}>{player.name} ({player.position})</li>
                          ))}
                        </ul>
                      </div>
                      <div className="position-group">
                        <h4>DST</h4>
                        <ul>
                          {draftState.teamRosters[1].DST.map(player => (
                            <li key={player.id}>{player.name} ({player.position})</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
  
       
          
          {/* show when draft is finished */}
          {draftState.isDraftComplete && (
            <div className="draft-complete glass">
              <h3>🎉 Draft Complete!</h3>
              <p>All players have been drafted. Check the draft board above to see the results.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.reload()}
              >
                Start New Draft
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockDraft;
