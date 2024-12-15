import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, FaGamepad, FaTasks, FaStore, FaTrophy, FaCog, 
  FaChartLine, FaBalanceScale, FaDatabase, FaPlus,
  FaBars, FaTimes, FaSignOutAlt, FaEdit
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';
import CardManagement from './1CardManagement';
import TaskManagement from './TaskManagement';
import CategoryManagement from './CategoryManagement';
import MovesAndSkillsManagement from './MovesAndSkillsManagement';
import ClassManagement from './ClassManagement';
import BulkEditCards from './BulkEditCards';
import Settings from './Settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, players } = usePlayerStore();
  const { 
    cards, 
    categories,
    tasks,
    currentMatches,
    matchHistory,
    activePlayers,
    totalMatches,
    onlinePlayers
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Calculate real stats
  const totalBattles = matchHistory?.length || 0;
  const activeBattles = currentMatches?.filter(match => match.status === 'in_progress').length || 0;
  const completedTasks = tasks?.filter(task => task.completed).length || 0;
  const activeCards = cards?.filter(card => card.isActive).length || 0;

  const stats = {
    totalCards: cards?.length || 0,
    activeCards,
    totalCategories: categories?.length || 0,
    activePlayers: activePlayers || 0,
    onlinePlayers: onlinePlayers || 0,
    totalBattles,
    activeBattles,
    completedTasks,
  };

  const sidebarWidth = isSidebarCollapsed ? 'w-16' : 'w-64';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'cards', label: 'Cards', icon: FaGamepad },
    { id: 'tasks', label: 'Tasks & Jobs', icon: FaTasks },
    { id: 'categories', label: 'Categories', icon: FaDatabase },
    { id: 'moves', label: 'Moves & Skills', icon: FaGamepad },
    { id: 'classes', label: 'Classes', icon: FaUsers },
    { id: 'bulk', label: 'Bulk Edit', icon: FaEdit },
    { id: 'balance', label: 'Game Balance', icon: FaBalanceScale },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <motion.div 
        className={`fixed h-full ${sidebarWidth} bg-gray-800 transition-all duration-300 ease-in-out`}
        initial={false}
        animate={{ width: isSidebarCollapsed ? 64 : 256 }}
      >
        <div className="p-4 flex justify-between items-center">
          {!isSidebarCollapsed && <h2 className="text-xl font-bold text-white">Admin</h2>}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-white hover:text-pink-500 transition-colors"
          >
            {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        
        <div className="mt-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              } transition-colors`}
            >
              <tab.icon className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isSidebarCollapsed && <span>{tab.label}</span>}
            </button>
          ))}
          
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 mt-auto"
          >
            <FaSignOutAlt className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} p-8 transition-all duration-300`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Total Cards', value: stats.totalCards, icon: FaGamepad, color: 'pink' },
                  { label: 'Active Cards', value: stats.activeCards, icon: FaGamepad, color: 'green' },
                  { label: 'Categories', value: stats.totalCategories, icon: FaDatabase, color: 'purple' },
                  { label: 'Active Players', value: stats.activePlayers, icon: FaUsers, color: 'blue' },
                  { label: 'Online Players', value: stats.onlinePlayers, icon: FaUsers, color: 'teal' },
                  { label: 'Total Battles', value: stats.totalBattles, icon: FaTrophy, color: 'yellow' },
                  { label: 'Active Battles', value: stats.activeBattles, icon: FaGamepad, color: 'red' },
                  { label: 'Completed Tasks', value: stats.completedTasks, icon: FaTasks, color: 'indigo' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className={`text-${stat.color}-500 text-2xl`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {activeTab === 'cards' && <CardManagement />}
            {activeTab === 'tasks' && <TaskManagement />}
            {activeTab === 'categories' && <CategoryManagement />}
            {activeTab === 'moves' && <MovesAndSkillsManagement />}
            {activeTab === 'classes' && <ClassManagement />}
            {activeTab === 'bulk' && <BulkEditCards />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'balance' && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Game Balance</h2>
                <p>Configure game mechanics, rewards, and difficulty settings.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
