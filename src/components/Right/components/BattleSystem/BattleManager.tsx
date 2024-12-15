import React, { useState } from 'react';
import { BattleScene } from './BattleScene';
import { BattleCard } from './types';
import { mockBattleCard, mockOpponentCard } from './mockCards';

interface BattleManagerProps {
  onBattleEnd: (rewards: { money: number; experience: number }) => void;
}

export const BattleManager: React.FC<BattleManagerProps> = ({ onBattleEnd }) => {
  const [isBattleActive, setIsBattleActive] = useState(false);

  const handleBattleEnd = (winner: BattleCard) => {
    // Calculate rewards based on the battle outcome
    const rewards = {
      money: Math.floor(Math.random() * 100) + 50, // Random reward between 50-150
      experience: Math.floor(Math.random() * 50) + 25 // Random XP between 25-75
    };

    setIsBattleActive(false);
    onBattleEnd(rewards);
  };

  const startBattle = () => {
    setIsBattleActive(true);
  };

  return (
    <div className="w-full h-full">
      {!isBattleActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={startBattle}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                     transition-colors duration-200 shadow-lg hover:shadow-xl
                     transform hover:scale-105 active:scale-95"
          >
            Start Battle
          </button>
        </div>
      ) : (
        <BattleScene
          playerCard={mockBattleCard}
          opponentCard={mockOpponentCard}
          onBattleEnd={handleBattleEnd}
        />
      )}
    </div>
  );
};
