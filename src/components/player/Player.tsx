import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../../store/1playerStore';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

const Player = () => {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const { cards, selectedCard } = useGameStore();
  const [activeTab, setActiveTab] = useState('battle');

  const tabs = [
    { id: 'battle', label: 'Battle' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'shop', label: 'Shop' },
    { id: 'achievements', label: 'Achievements' }
  ];

  if (!player) {
    return <div>Loading player data...</div>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4">
      {/* Left Column - Active Card and Stats */}
      <div className="w-1/3 mr-4">
        {selectedCard && (
          <div className="relative rounded-lg overflow-hidden mb-4 bg-black/30 backdrop-blur-sm">
            <img
              src={selectedCard.imageUrl}
              alt={selectedCard.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-red-400">Attack:</span>
                  <span className="ml-2">{selectedCard.stats?.attack || 0}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400">Defense:</span>
                  <span className="ml-2">{selectedCard.stats?.defense || 0}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400">Speed:</span>
                  <span className="ml-2">{selectedCard.stats?.speed || 0}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400">Energy:</span>
                  <span className="ml-2">{selectedCard.stats?.energy || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player Stats */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4">Player Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Level:</span>
              <span className="ml-2">{player.level}</span>
            </div>
            <div>
              <span className="text-gray-400">Experience:</span>
              <span className="ml-2">{player.experience}</span>
            </div>
            <div>
              <span className="text-gray-400">Currency:</span>
              <span className="ml-2">{player.currency}</span>
            </div>
            <div>
              <span className="text-gray-400">Classes:</span>
              <span className="ml-2">{player.classes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Tabs */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm rounded-lg">
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'battle' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Battle Arena</h3>
                  {/* Add battle content here */}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Available Tasks</h3>
                  {/* Add tasks content here */}
                </div>
              )}

              {activeTab === 'inventory' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Inventory</h3>
                  {/* Add inventory content here */}
                </div>
              )}

              {activeTab === 'shop' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Shop</h3>
                  {/* Add shop content here */}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Achievements</h3>
                  {/* Add achievements content here */}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Player;
