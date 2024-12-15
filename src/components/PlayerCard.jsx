import React from 'react'

const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <img src={player.avatar} alt={player.name} className="player-avatar" />
      <div className="player-info">
        <h3>{player.name}</h3>
        <span className={`status ${player.status}`}>{player.status}</span>
      </div>
    </div>
  )
}

export default PlayerCard
