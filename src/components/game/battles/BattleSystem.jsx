import React from 'react';
import { useCards } from '../../../hooks/useCards';
import { FaStar, FaHeart, FaShieldAlt, FaBolt } from 'react-icons/fa';

export const BattleSystem = () => {
  const { getCardsByCategory } = useCards();
  const battleCards = getCardsByCategory('BATTLE') || [];

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4">
      <h3 className="text-lg font-bold text-purple-300 mb-3 text-center">Battle Opponents</h3>
      <div className="grid grid-cols-3 gap-3">
        {battleCards.slice(0, 3).map((card) => (
          <div key={card.id} className="group cursor-pointer">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 hover:border-purple-500/50 transition-all duration-200">
              <div className="flex flex-col items-center gap-2">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-bold text-white">{card.name}</h3>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="text-sm text-gray-300">Level {card.level || 1}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full mt-2">
                  <div className="flex items-center justify-center gap-1 bg-red-500/20 rounded-lg p-1">
                    <FaHeart className="text-red-400" />
                    <span className="text-xs text-gray-300">{card.power || 0}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 bg-blue-500/20 rounded-lg p-1">
                    <FaShieldAlt className="text-blue-400" />
                    <span className="text-xs text-gray-300">{card.defense || 0}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 bg-yellow-500/20 rounded-lg p-1">
                    <FaBolt className="text-yellow-400" />
                    <span className="text-xs text-gray-300">{card.speed || 0}</span>
                  </div>
                </div>
                <button className="mt-2 w-full px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-sm text-purple-300 transition-all border border-purple-500/30 hover:border-purple-500/50">
                  Battle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
