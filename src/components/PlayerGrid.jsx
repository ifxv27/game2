import React from 'react'
import PlayerCard from './PlayerCard'

const PlayerGrid = () => {
  const players = [
    { id: 1, name: 'Player 1', avatar: 'https://via.placeholder.com/50', status: 'online' },
    { id: 2, name: 'Player 2', avatar: 'https://via.placeholder.com/50', status: 'offline' },
    { id: 3, name: 'Player 3', avatar: 'https://via.placeholder.com/50', status: 'online' },
  ]

  return (
    <div className="player-grid">
      <h2 className="grid-title">Players</h2>
      <div className="grid-container">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

export default PlayerGrid
