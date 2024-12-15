import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { useGameStore } from '../../store/gameStore';
import { FaUsers, FaGamepad, FaTrophy, FaCog } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { currentAdmin, gameStats, logout } = useAdminStore();
  const { cards } = useGameStore();

  if (!currentAdmin) {
    navigate('/login');
    return null;
  }

  const stats = [
    {
      title: 'Total Players',
      value: gameStats.totalPlayers,
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Games',
      value: gameStats.activeMatches,
      icon: FaGamepad,
      color: 'bg-green-500',
    },
    {
      title: 'Total Matches',
      value: gameStats.totalMatches,
      icon: FaTrophy,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Cards',
      value: cards.length,
      icon: FaCog,
      color: 'bg-red-500',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {currentAdmin.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-lg mb-8">
          <nav className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'players'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Players
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'cards'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Recent Activity
                </h3>
                {/* Add recent activity content */}
              </div>
            )}
            {activeTab === 'players' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Player Management
                </h3>
                {/* Add player management content */}
              </div>
            )}
            {activeTab === 'cards' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Card Management
                </h3>
                {/* Add card management content */}
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Game Settings
                </h3>
                {/* Add settings content */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
