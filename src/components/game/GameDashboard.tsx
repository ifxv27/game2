import React, { useState } from 'react';
import { motion } from 'framer-motion';
import usePlayerStore from '../../store/1playerStore';
import { useGameStore } from '../../store/gameStore';
import { FaGamepad, FaBoxOpen, FaCog, FaDice } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import styles from '../player/Player.module.css';
import { Card } from '../../types/card';
import CreateCharacterModal from './CreateCharacterModal';

type TabType = 'battle' | 'tasks' | 'gamble';

const GameDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('battle');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { player, experience, level, inventory } = usePlayerStore();
  const { cards, tasks, categories } = useGameStore();

  // Get the player's current card
  const playerCard = cards.find(card => card.id === player?.cardId);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'battle', label: 'Battle', icon: <FaGamepad /> },
    { id: 'tasks', label: 'Tasks & Jobs', icon: <MdWork /> },
    { id: 'gamble', label: 'Gamble', icon: <FaDice /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'battle':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Battle Arena</h3>
            <div className="grid grid-cols-1 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg">
                Quick Match
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg">
                Ranked Battle
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg">
                Practice Mode
              </button>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Available Tasks</h3>
            <div className="grid grid-cols-1 gap-4">
              {tasks?.map((task) => (
                <div key={task.id} className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-white font-semibold">{task.name}</h4>
                  <p className="text-gray-400 text-sm">{task.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-yellow-400">+{task.reward.experience} XP</span>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      onClick={() => player?.startTask(task.id)}
                    >
                      Start Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'gamble':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Gambling Den</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-semibold">Card Flip</h4>
                <p className="text-gray-400 text-sm">Double or nothing! Flip a coin to test your luck.</p>
                <button className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
                  Place Bet
                </button>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-semibold">Dice Roll</h4>
                <p className="text-gray-400 text-sm">Roll the dice for a chance to multiply your coins!</p>
                <button className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
                  Place Bet
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Player Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Player Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
            {playerCard ? (
              <>
                <img
                  src={playerCard.imageUrl}
                  alt={playerCard.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{playerCard.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-2 rounded">
                    <span className="text-gray-400">Level</span>
                    <p className="text-xl font-bold">{level}</p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded">
                    <span className="text-gray-400">XP</span>
                    <p className="text-xl font-bold">{experience}</p>
                  </div>
                </div>
                {/* Stats */}
                <div className="mt-4 space-y-2">
                  {Object.entries(playerCard.stats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between items-center">
                      <span className="capitalize text-gray-400">{stat}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No character selected</p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Create Character
                </button>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex justify-around">
              <button className="flex flex-col items-center text-gray-400 hover:text-white">
                <FaBoxOpen className="text-2xl mb-1" />
                <span>Inventory</span>
              </button>
              <button className="flex flex-col items-center text-gray-400 hover:text-white">
                <FaCog className="text-2xl mb-1" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Game Content */}
        <div className="lg:col-span-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 ${
                    activeTab === tab.id
                      ? 'bg-gray-700/50 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      <CreateCharacterModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default GameDashboard;
