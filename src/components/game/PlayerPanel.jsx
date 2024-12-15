import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaStore, FaExchangeAlt, FaDice, FaTrophy, FaChartLine, FaStar, FaGem, FaCoins, FaHeart, FaBolt } from 'react-icons/fa';
import { useCards } from '../../hooks/useCards';

const PlayerPanel = () => {
  const playerProfile = useGameStore((state) => state.playerProfile);
  const { getClassName } = useCards();

  if (!playerProfile) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        <p className="text-purple-300">Loading profile...</p>
      </div>
    );
  }

  const { name, character, money = 1000, stats = { wins: 0, losses: 0 } } = playerProfile;
  const level = character?.level || 1;

  const quickLinks = [
    { icon: FaStore, label: 'Store', action: () => console.log('Store clicked'), color: 'from-yellow-600 to-amber-500', desc: 'Buy new cards and items' },
    { icon: FaExchangeAlt, label: 'Trade', action: () => console.log('Trade clicked'), color: 'from-blue-600 to-cyan-500', desc: 'Trade with other players' },
    { icon: FaDice, label: 'Games', action: () => console.log('Games clicked'), color: 'from-purple-600 to-pink-500', desc: 'Play mini-games' },
    { icon: FaTrophy, label: 'Achievements', action: () => console.log('Achievements clicked'), color: 'from-green-600 to-emerald-500', desc: 'View your achievements' },
    { icon: FaChartLine, label: 'Stats', action: () => console.log('Stats clicked'), color: 'from-red-600 to-rose-500', desc: 'Check your statistics' },
  ];

  return (
    <div className="bg-gradient-to-br from-black/70 to-purple-900/50 rounded-xl border-2 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-xl">
      {/* Character Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur"></div>
        <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6 space-y-6">
          {/* Character Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30">
            {character?.image ? (
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                <span className="text-purple-300">No Character Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-xl font-bold text-white">{character.name}</h2>
              <p className="text-purple-300">{getClassName(character.class)}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-y-1/2 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <div className="relative z-10 flex justify-center">
              <span className="px-4 py-1 text-sm font-medium text-purple-400 bg-black/80 rounded-full border border-purple-500/30">
                Stats & Currency
              </span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <FaHeart className="text-red-500" />
                <span className="text-purple-300">Health</span>
                <span className="ml-auto text-white">{character.health}/100</span>
              </div>
              <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full"
                  style={{ width: `${character.health}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <FaBolt className="text-yellow-500" />
                <span className="text-purple-300">Energy</span>
                <span className="ml-auto text-white">{character.energy}/100</span>
              </div>
              <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-1.5 rounded-full"
                  style={{ width: `${character.energy}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <FaCoins className="text-yellow-400" />
                <span className="text-purple-300">Gold</span>
                <span className="ml-auto text-white">{money}</span>
              </div>
            </div>

            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <FaGem className="text-blue-400" />
                <span className="text-purple-300">Gems</span>
                <span className="ml-auto text-white">{character.gems}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-y-1/2 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <div className="relative z-10 flex justify-center">
              <span className="px-4 py-1 text-sm font-medium text-purple-400 bg-black/80 rounded-full border border-purple-500/30">
                Quick Actions
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaStore, label: 'Shop', tooltip: 'Visit the store' },
              { icon: FaBox, label: 'Inventory', tooltip: 'View your items' },
              { icon: FaTrophy, label: 'Achievements', tooltip: 'View your achievements' },
              { icon: FaCog, label: 'Settings', tooltip: 'Game settings' }
            ].map((action) => (
              <button
                key={action.label}
                className="group relative flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300"
                title={action.tooltip}
              >
                <span className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></span>
                <action.icon className="relative text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="relative text-purple-300 group-hover:text-purple-200 transition-colors">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-300 text-sm">Level {level}</span>
              <span className="text-purple-400 text-sm">{stats.wins}/100 XP</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${stats.wins}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPanel;
