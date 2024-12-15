import React from 'react';
import { motion } from 'framer-motion';
import StarDisplay from '../shared/StarDisplay';
import { RARITY } from '../../constants/cardRarity';
import useDailyTaskStore from '../../store/dailyTaskStore';

const LuckyCardRoll = () => {
  const { luckyCard, rollLuckyCard } = useDailyTaskStore();
  const rarity = Object.values(RARITY).find(r => r.stars === luckyCard?.starRank);

  const handleRoll = () => {
    rollLuckyCard();
  };

  if (!luckyCard) {
    return (
      <div className="w-full p-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-purple-300">Lucky Roll</h3>
          <button
            onClick={handleRoll}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded
                     transition-colors duration-200"
          >
            Roll Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-purple-300">Lucky Roll</h3>
        <button
          onClick={handleRoll}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded
                   transition-colors duration-200"
        >
          Roll Again
        </button>
      </div>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative p-1 rounded-lg ${rarity?.bgGlow || ''}`}
      >
        <div className="bg-gray-800/50 rounded-lg p-2">
          <div className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <img 
                src={luckyCard.imageUrl} 
                alt={luckyCard.name}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute -top-1 -right-1">
                <StarDisplay count={luckyCard.starRank} size="sm" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-bold truncate ${rarity?.color || 'text-white'}`}>
                {luckyCard.name}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-2">{luckyCard.description}</p>
              
              {luckyCard.stats && (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  <div className="text-center">
                    <span className="text-xs text-purple-400">PWR</span>
                    <p className="text-xs text-white">{luckyCard.stats.power || 0}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-blue-400">NRG</span>
                    <p className="text-xs text-white">{luckyCard.stats.energy || 0}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-red-400">HP</span>
                    <p className="text-xs text-white">{luckyCard.stats.health || 0}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-green-400">DEF</span>
                    <p className="text-xs text-white">{luckyCard.stats.defense || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LuckyCardRoll;
