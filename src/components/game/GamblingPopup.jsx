import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import GamblingGame from './GamblingGame';

const GamblingPopup = ({ gameType, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { playerProfile, updatePlayerProfile } = useGameStore();

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`bg-purple-900/90 p-6 rounded-xl border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full max-w-xl transform transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-300">
            {gameType === 'coinflip' && 'Coin Flip'}
            {gameType === 'dice' && 'Dice Roll'}
            {gameType === 'slots' && 'Slot Machine'}
            {gameType === 'cards' && 'Card Draw'}
          </h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="relative">
          <GamblingGame gameType={gameType} />
        </div>
      </div>
    </div>
  );
};

export default GamblingPopup;
