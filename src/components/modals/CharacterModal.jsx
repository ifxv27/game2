import React from 'react';
import { FaHeart, FaBolt, FaFistRaised, FaShieldAlt, FaTimes, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { GiUpgrade } from 'react-icons/gi';

const CharacterModal = ({ character, onClose, onEdit, onUpgrade, onDelete }) => {
  if (!character) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const stats = character.stats || {
    health: 100,
    energy: 100,
    power: 85,
    defense: 75
  };

  const skills = character.skills || [
    { name: "Fireball", cost: 20, damage: 50, type: "Magic" },
    { name: "Quick Strike", cost: 15, damage: 35, type: "Physical" },
    { name: "Shield Bash", cost: 25, damage: 40, type: "Physical" },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl border-2 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-display">
              {character.name}
            </h2>
            <span className="text-yellow-400 text-xl">{'⭐'.repeat(character.starRank || 1)}</span>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-6 p-6">
          {/* Left side - Image */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-lg">
              <img
                src={character.imageUrl || character.image}
                alt={character.name}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => onEdit(character)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => onUpgrade(character)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg border border-yellow-500/30 transition-colors"
              >
                <GiUpgrade />
                <span>Upgrade</span>
              </button>
              <button 
                onClick={() => onDelete(character)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 transition-colors"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Center - Divider */}
          <div className="w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>

          {/* Right side - Stats & Skills */}
          <div className="space-y-6">
            {/* Stats Section */}
            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-3">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FaHeart, label: 'Health', value: stats.health, max: 100, color: 'red' },
                  { icon: FaBolt, label: 'Energy', value: stats.energy, max: 100, color: 'yellow' },
                  { icon: FaFistRaised, label: 'Power', value: stats.power, max: 100, color: 'orange' },
                  { icon: FaShieldAlt, label: 'Defense', value: stats.defense, max: 100, color: 'emerald' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-black/40 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`text-${stat.color}-500`} />
                      <span className="text-purple-200">{stat.label}</span>
                      <span className="text-white ml-auto">{stat.value}/{stat.max}</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 h-2 rounded-full`}
                        style={{ width: `${(stat.value / stat.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-3">Skills</h3>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-black/40 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 font-medium">{skill.name}</span>
                      <span className="text-blue-300">Cost: {skill.cost}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-400">Damage: {skill.damage}</span>
                      <span className="text-purple-300">{skill.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
