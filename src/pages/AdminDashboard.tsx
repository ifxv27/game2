import React, { useState } from 'react';
import { MovesAndSkillsManagement } from '../components/admin/MovesAndSkillsManagement';
import { motion } from 'framer-motion';
import { FaCog, FaGamepad, FaUsers, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<'moves' | 'players' | 'stats' | 'settings'>('moves');

  const renderContent = () => {
    switch (activeSection) {
      case 'moves':
        return <MovesAndSkillsManagement />;
      case 'players':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Player Management</h2>
            {/* Player management content will go here */}
          </div>
        );
      case 'stats':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Game Statistics</h2>
            {/* Stats content will go here */}
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
            {/* Settings content will go here */}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-pink-500/20 overflow-hidden">
          <div className="grid grid-cols-5">
            {/* Sidebar */}
            <div className="col-span-1 bg-gray-900/50 p-6 border-r border-pink-500/20">
              <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Admin Dashboard
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('moves')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === 'moves'
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-gray-400 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <FaGamepad />
                  <span>Moves & Skills</span>
                </button>
                <button
                  onClick={() => setActiveSection('players')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === 'players'
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-gray-400 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <FaUsers />
                  <span>Players</span>
                </button>
                <button
                  onClick={() => setActiveSection('stats')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === 'stats'
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-gray-400 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <FaChartLine />
                  <span>Statistics</span>
                </button>
                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === 'settings'
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'text-gray-400 hover:bg-pink-500/10 hover:text-pink-400'
                  }`}
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="col-span-4">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
