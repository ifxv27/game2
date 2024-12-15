import React from 'react';
import { usePlayerStore } from '../store/playerStore';
import GameDashboard from './game/GameDashboard';
import Navbar from './ui/Navbar';
import CharacterCreation from './player/CharacterCreation';

const Game = () => {
  const { currentPlayer } = usePlayerStore();
  
  // If no player or no starter card, show character creation
  if (!currentPlayer || !currentPlayer.hasStarterCard) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <CharacterCreation />
        </div>
      </div>
    );
  }

  // Otherwise show the game
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <GameDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
