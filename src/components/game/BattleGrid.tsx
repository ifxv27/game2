import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaFire, FaSkull, FaTrophy, FaBolt, FaShieldAlt, FaHeart, FaStar } from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';
import { Card } from '../../types/card';

const BattleGrid: React.FC = () => {
  const { cards } = useGameStore();
  const { currentPlayer } = usePlayerStore();
  const battleCards = cards.filter(card => card.category === 'Battle Cards');

  const canBattle = (card: Card) => {
    if (!currentPlayer?.stats) return false;
    const cardStats = card.stats || { health: 0, energy: 0 };
    return currentPlayer.stats.health >= cardStats.health * 0.5 && 
           currentPlayer.stats.energy >= (cardStats.mana || 0) * 0.5;
  };

  const calculateRewards = (card: Card) => {
    const baseGold = 50;
    const baseXP = 25;
    const multiplier = card.starLevel || 1;
    
    return {
      gold: baseGold * multiplier,
      xp: baseXP * multiplier
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaFire className="text-red-500" />
          Available Battles
        </h3>
        <span className="text-sm text-gray-400">{battleCards.length} battles available</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {battleCards.map((card) => {
          const isAvailable = canBattle(card);
          const rewards = calculateRewards(card);
          const stats = card.stats || { attack: 0, defense: 0, health: 0, mana: 0 };
          
          return (
            <div
              key={card.id}
              className={`group relative bg-black/60 rounded-lg overflow-hidden border ${
                isAvailable ? 'border-red-500/20 hover:border-red-500/40' : 'border-gray-700'
              } transition-all duration-300 hover:transform hover:scale-[1.02]`}
            >
              {/* Card Image */}
              <div className="relative h-48">
                <img
                  src={card.imageUrl || '/default-battle.jpg'}
                  alt={card.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-battle.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
                
                {/* Star Rating - Top Right */}
                <div className="absolute top-2 right-2 z-10 flex gap-1 bg-black/60 rounded-full px-3 py-1">
                  {Array(card.starLevel || 1).fill('★').join('')}
                </div>
              </div>

              <div className="p-4">
                {/* Battle Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-red-400 transition-colors flex items-center gap-2">
                      {card.name}
                      <span className="text-yellow-500 text-sm">
                        {Array(card.starLevel || 1).fill('★').join('')}
                      </span>
                    </h4>
                    <div className="text-sm text-gray-400">{card.description}</div>
                  </div>
                </div>

                {/* Battle Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FaHeart className="text-red-500" />
                      <span className="text-gray-300">{stats.health} HP</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaBolt className="text-yellow-500" />
                      <span className="text-gray-300">{stats.mana} EN</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FaFire className="text-orange-500" />
                      <span className="text-gray-300">{stats.attack} ATK</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaShieldAlt className="text-blue-500" />
                      <span className="text-gray-300">{stats.defense} DEF</span>
                    </div>
                  </div>
                </div>

                {/* Rewards Preview */}
                <div className="flex items-center justify-between text-sm border-t border-gray-700/50 pt-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaTrophy className="text-yellow-500" />
                      <span className="text-gray-300">{rewards.gold} Gold</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FaStar className="text-purple-500" />
                      <span className="text-gray-300">{rewards.xp} XP</span>
                    </span>
                  </div>
                  <button
                    className={`px-4 py-2 rounded ${
                      isAvailable
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isAvailable}
                  >
                    Battle
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {battleCards.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No battles available at the moment. Add some battle cards in Card Management.
        </div>
      )}
    </div>
  );
};

export default BattleGrid;
