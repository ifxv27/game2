import React from 'react';
import { useGameStore } from '../../store/gameStore';
import useAiGeneratorStore from '../../store/aiGeneratorStore';
import { FaCrown, FaStar, FaHeart, FaBolt, FaFistRaised, FaShieldAlt, FaEdit, FaChartLine } from 'react-icons/fa';
import { useCards } from '../../hooks/useCards';

const ProfileGrid = ({ onSelectCharacter }) => {
  const playerProfile = useGameStore((state) => state.playerProfile);
  const { getClassName } = useCards();
  
  if (!playerProfile || !playerProfile.selectedCard) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4">
        <p className="text-gray-400 text-center">No character selected</p>
      </div>
    );
  }

  const { selectedCard } = playerProfile;
  
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4">
      {/* Character Card */}
      <div className="relative mb-4">
        <div className="aspect-[2/3] rounded-lg overflow-hidden border-2 border-purple-500/50">
          <img 
            src={selectedCard.imageUrl || "https://placehold.co/300x450/purple/white?text=Character"} 
            alt={selectedCard.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FaCrown className="text-yellow-500" />
            {selectedCard.name}
          </h3>
          <p className="text-gray-300 text-sm flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            Level {selectedCard.level || 1}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-purple-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-400">
            <FaHeart />
            <span>Health</span>
          </div>
          <div className="text-xl font-bold text-white">{selectedCard.health || 100}</div>
        </div>
        <div className="bg-purple-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-400">
            <FaBolt />
            <span>Energy</span>
          </div>
          <div className="text-xl font-bold text-white">{selectedCard.energy || 100}</div>
        </div>
        <div className="bg-purple-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-400">
            <FaFistRaised />
            <span>Power</span>
          </div>
          <div className="text-xl font-bold text-white">{selectedCard.power || 10}</div>
        </div>
        <div className="bg-purple-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-400">
            <FaShieldAlt />
            <span>Defense</span>
          </div>
          <div className="text-xl font-bold text-white">{selectedCard.defense || 5}</div>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Level {selectedCard.level || 1}</span>
          <span>XP: {selectedCard.experience || 0}/100</span>
        </div>
        <div className="w-full h-2 bg-purple-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${(selectedCard.experience || 0)}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="btn-secondary flex items-center justify-center gap-2">
          <FaEdit />
          Edit
        </button>
        <button className="btn-secondary flex items-center justify-center gap-2">
          <FaChartLine />
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default ProfileGrid;
