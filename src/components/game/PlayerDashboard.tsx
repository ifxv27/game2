import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import usePlayerStore from '../../store/playerStore';
import { FaStar, FaBolt, FaStore, FaDice, FaCog, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PlayerDashboard = () => {
  const { player } = usePlayerStore();
  const { cards } = useGameStore();
  const [activeTab, setActiveTab] = useState<'battle' | 'tasks' | 'inventory'>('battle');

  // Get player's current card
  const playerCard = cards.find(card => card.id === player?.cardId);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'battle':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-500">Battle Arena</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Battle options will go here */}
              <div className="bg-gray-800/60 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all cursor-pointer">
                <h4 className="text-lg font-semibold">Quick Match</h4>
                <p className="text-gray-400">Find a random opponent</p>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all cursor-pointer">
                <h4 className="text-lg font-semibold">Ranked Battle</h4>
                <p className="text-gray-400">Compete for rankings</p>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-500">Tasks & Jobs</h3>
            <div className="space-y-2">
              {/* Tasks will be mapped here */}
              <div className="bg-gray-800/60 rounded-xl p-4 border border-pink-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Daily Training</h4>
                    <p className="text-sm text-gray-400">Complete 3 battles</p>
                  </div>
                  <div className="text-pink-500">0/3</div>
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full">
                  <div className="h-full w-1/3 bg-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-500">Inventory</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Inventory items will be mapped here */}
              <div className="bg-gray-800/60 rounded-xl p-3 border border-pink-500/20 text-center">
                <div className="text-2xl mb-1">🔮</div>
                <div className="text-sm font-semibold">Power Crystal</div>
                <div className="text-xs text-gray-400">x3</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl border border-pink-500/30 relative flex">
        {/* Neon Glow Border */}
        <div className="absolute inset-[-2px] bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-[calc(0.75rem+2px)] opacity-50 blur-lg z-[-1]"></div>
        
        {/* Left Column - Card Display & Quick Links */}
        <div className="w-1/3 p-6 flex flex-col">
          {/* Card Display */}
          <div className="relative">
            <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden border-2 border-pink-500/30 shadow-2xl">
              {playerCard?.imageUrl ? (
                <img 
                  src={playerCard.imageUrl} 
                  alt="Player Card" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800/50 flex items-center justify-center text-gray-400">
                  No Card Selected
                </div>
              )}
            </div>
            
            {/* Card Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center space-x-2">
                    <FaBolt className="text-yellow-500" />
                    <span>Power: {playerCard?.stats?.power || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(playerCard?.starLevel || 0)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-300">ATK: {playerCard?.stats?.attack || 0}</div>
                  <div className="text-gray-300">DEF: {playerCard?.stats?.defense || 0}</div>
                  <div className="text-gray-300">SPD: {playerCard?.stats?.speed || 0}</div>
                  <div className="text-gray-300">ENR: {playerCard?.stats?.energy || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-800/60 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <FaStore className="text-2xl mb-2 text-pink-500" />
              <span className="text-sm">Store</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-800/60 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <FaDice className="text-2xl mb-2 text-pink-500" />
              <span className="text-sm">Gamble</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-800/60 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <FaCog className="text-2xl mb-2 text-pink-500" />
              <span className="text-sm">Settings</span>
            </button>
          </div>

          {/* Player Stats Panel */}
          <div className="mt-6 p-4 bg-gray-800/60 rounded-xl border border-pink-500/20 space-y-4">
            {/* Health Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Health</span>
                <div className="flex items-center">
                  <FaHeart className="text-red-500 mr-2" />
                  <span>{player?.health || 100}/100</span>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${player?.health || 100}%` }}
                ></div>
              </div>
            </div>

            {/* Energy Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Energy</span>
                <div className="flex items-center">
                  <FaBolt className="text-yellow-500 mr-2" />
                  <span>{player?.energy || 100}/100</span>
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${player?.energy || 100}%` }}
                ></div>
              </div>
            </div>

            {/* Player Level & XP */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400">Level</div>
                <div className="text-xl font-bold">{player?.level || 1}</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>XP</span>
                  <span>{player?.xp || 0}/1000</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${((player?.xp || 0) / 1000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Currency & Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                <div className="text-yellow-500 text-sm">Coins</div>
                <div className="font-bold">{player?.coins || 0}</div>
              </div>
              <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                <div className="text-purple-500 text-sm">Gems</div>
                <div className="font-bold">{player?.gems || 0}</div>
              </div>
              <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                <div className="text-green-500 text-sm">Wins</div>
                <div className="font-bold">{player?.wins || 0}</div>
              </div>
              <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                <div className="text-red-500 text-sm">Losses</div>
                <div className="font-bold">{player?.losses || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[2px] bg-gradient-to-b from-transparent via-pink-500/50 to-transparent my-6"></div>
        
        {/* Right Column - Tabs & Content */}
        <div className="w-2/3 p-6 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('battle')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'battle'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:text-white'
              }`}
            >
              Battle
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'tasks'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:text-white'
              }`}
            >
              Tasks & Jobs
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'inventory'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:text-white'
              }`}
            >
              Inventory
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
