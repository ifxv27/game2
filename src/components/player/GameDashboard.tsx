import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSignOutAlt, FaUser, FaStar, FaExchangeAlt, FaGamepad, 
  FaChartBar, FaDice, FaTasks, FaStore, FaCog, FaTrophy,
  FaHeart, FaBolt, FaShieldAlt, FaMagic, FaRunning
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../../store/1playerStore';
import { useGameStore } from '../../store/gameStore';
import { useAdminStore } from '../../store/adminStore';
import backgroundImage from '../ui/797270145169939246.png';

const GameDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    logout, 
    username,
    characters,
    activeCharacter,
    selectCharacter,
    startBattle,
    startTask,
    completeTask,
    useEnergy,
    rechargeEnergy
  } = usePlayerStore();
  
  const { cards } = useGameStore();
  const { 
    gameBalance,
    battleTypes,
    taskCategories,
    battleRewards
  } = useAdminStore();
  
  // Filter battle cards
  const battleCards = cards.filter(card => card.category === 'Battle');
  
  const [activeTab, setActiveTab] = useState('battles');
  const [selectedBattleType, setSelectedBattleType] = useState('PvE');
  const [selectedBattleCard, setSelectedBattleCard] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  // Get active character data
  const character = characters.find(char => char.id === activeCharacter);
  
  // Find the character's active card details
  const playerActiveCard = cards.find(card => character?.cardId === card.id);

  useEffect(() => {
    // Recharge energy periodically
    const interval = setInterval(() => {
      rechargeEnergy();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [rechargeEnergy]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartBattle = async () => {
    if (!character || character.energyPoints < 10) {
      alert('Not enough energy points!');
      return;
    }

    if (!selectedBattleCard) {
      alert('Please select a battle card first!');
      return;
    }

    useEnergy(10);
    const result = await startBattle(selectedBattleType.toLowerCase(), selectedBattleCard);
    setBattleResult(result);
  };

  const handleStartTask = async (taskId: string) => {
    if (!character || character.energyPoints < 5) {
      alert('Not enough energy points!');
      return;
    }

    useEnergy(5);
    await startTask(taskId);
    setActiveTask(taskId);
  };

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId);
    setActiveTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <FaUser className="text-pink-500" />
            <div>
              <h1 className="text-xl font-bold text-white">{username}</h1>
              <p className="text-sm text-gray-400">Level {character?.level || 1}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaBolt className="text-yellow-500" />
              <span>{character?.energyPoints || 0}/{character?.maxEnergyPoints || 100}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-pink-600 hover:bg-pink-700"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Active Card & Quick Links */}
          <div className="col-span-3">
            {/* Active Card */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold mb-4">Active Card</h2>
              {playerActiveCard && (
                <div className="relative">
                  <img
                    src={playerActiveCard.imageUrl}
                    alt={playerActiveCard.name}
                    className="w-full rounded-lg mb-2"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <h3 className="font-bold">{playerActiveCard.name}</h3>
                  </div>
                </div>
              )}
              
              {/* Card Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center space-x-2">
                  <FaHeart className="text-red-500" />
                  <span>{character?.stats.health}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBolt className="text-yellow-500" />
                  <span>{character?.stats.energy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-blue-500" />
                  <span>{character?.stats.defense}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMagic className="text-purple-500" />
                  <span>{character?.stats.power}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-500" />
                  <span>{character?.stats.luck}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRunning className="text-green-500" />
                  <span>{character?.stats.speed}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FaStore />
                  <span>Store</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FaExchangeAlt />
                  <span>Trade</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FaGamepad />
                  <span>Inventory</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FaChartBar />
                  <span>Stats</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FaCog />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs */}
          <div className="col-span-9">
            <div className="bg-gray-800 rounded-lg p-4">
              {/* Tab Navigation */}
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab('battles')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    activeTab === 'battles' ? 'bg-pink-600' : 'bg-gray-700'
                  }`}
                >
                  <FaGamepad />
                  <span>Battles</span>
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    activeTab === 'tasks' ? 'bg-pink-600' : 'bg-gray-700'
                  }`}
                >
                  <FaTasks />
                  <span>Tasks</span>
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    activeTab === 'achievements' ? 'bg-pink-600' : 'bg-gray-700'
                  }`}
                >
                  <FaTrophy />
                  <span>Achievements</span>
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'battles' && (
                    <div>
                      <div className="flex space-x-4 mb-4">
                        {battleTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setSelectedBattleType(type)}
                            className={`px-4 py-2 rounded ${
                              selectedBattleType === type ? 'bg-pink-600' : 'bg-gray-700'
                            } hover:bg-pink-700 transition-all duration-200`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {battleCards.map((card) => (
                          <div 
                            key={card.id}
                            onClick={() => setSelectedBattleCard(card.id)}
                            className={`relative cursor-pointer transform hover:scale-105 transition-all duration-200 ${
                              selectedBattleCard === card.id ? 'ring-2 ring-pink-500' : ''
                            }`}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '20px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              padding: '1rem',
                            }}
                          >
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="w-full h-48 object-cover rounded-lg mb-2"
                            />
                            <div className="p-2">
                              <h3 className="font-bold text-lg text-white mb-1">{card.name}</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-1">
                                  <FaHeart className="text-pink-500" />
                                  <span>{card.stats.health}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FaMagic className="text-purple-500" />
                                  <span>{card.stats.power}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FaShieldAlt className="text-blue-500" />
                                  <span>{card.stats.defense}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FaRunning className="text-green-500" />
                                  <span>{card.stats.speed}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-opacity-20 backdrop-blur-lg bg-gray-700 rounded-lg p-4 border border-pink-500/20">
                          <h3 className="text-lg font-bold mb-4 text-pink-400">Battle Info</h3>
                          <p className="text-gray-300">Win Rate: {(gameBalance.battleWinRate * 100).toFixed(1)}%</p>
                          <p className="text-gray-300">Energy Cost: 10 points</p>
                          <p className="text-gray-300 mt-2">Rewards:</p>
                          <ul className="list-disc list-inside text-gray-300">
                            {battleRewards.map((reward) => (
                              <li key={reward.type}>
                                {reward.type}: {reward.baseAmount} (x{reward.multiplier})
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={handleStartBattle}
                            disabled={!selectedBattleCard}
                            className="w-full mt-4 px-4 py-2 rounded bg-gradient-to-r from-pink-500 to-purple-600 
                              hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                          >
                            {selectedBattleCard ? 'Start Battle' : 'Select a Battle Card'}
                          </button>
                        </div>
                        
                        {battleResult && (
                          <div className="bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-bold mb-4">Battle Result</h3>
                            <p className={`text-xl font-bold ${
                              battleResult.result === 'win' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {battleResult.result.toUpperCase()}
                            </p>
                            <p>Rewards:</p>
                            <ul className="list-disc list-inside">
                              <li>Experience: {battleResult.rewards.experience}</li>
                              <li>Gold: {battleResult.rewards.gold}</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'tasks' && (
                    <div className="grid grid-cols-2 gap-4">
                      {taskCategories.map((category) => (
                        <div key={category} className="bg-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-bold mb-4">{category} Tasks</h3>
                          <div className="space-y-2">
                            {character?.tasks
                              .filter((task) => task.category === category)
                              .map((task) => (
                                <div
                                  key={task.id}
                                  className="bg-gray-600 rounded-lg p-4"
                                >
                                  <h4 className="font-bold">{task.name}</h4>
                                  <p className="text-sm text-gray-300">{task.description}</p>
                                  <div className="mt-2">
                                    <p>Rewards:</p>
                                    <ul className="list-disc list-inside text-sm">
                                      <li>Experience: {task.reward.experience}</li>
                                      <li>Gold: {task.reward.gold}</li>
                                    </ul>
                                  </div>
                                  {task.status === 'available' && (
                                    <button
                                      onClick={() => handleStartTask(task.id)}
                                      className="w-full mt-2 px-4 py-2 rounded bg-pink-600 hover:bg-pink-700"
                                    >
                                      Start Task
                                    </button>
                                  )}
                                  {task.status === 'in_progress' && (
                                    <button
                                      onClick={() => handleCompleteTask(task.id)}
                                      className="w-full mt-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                                    >
                                      Complete Task
                                    </button>
                                  )}
                                  {task.status === 'completed' && (
                                    <p className="text-green-500 mt-2">Completed!</p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'achievements' && (
                    <div className="grid grid-cols-2 gap-4">
                      {character?.achievements.map((achievement) => (
                        <div key={achievement} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <FaTrophy className="text-yellow-500" />
                            <h3 className="font-bold">{achievement}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
