import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import usePlayerStore from '../store/1playerStore';
import { FaStar, FaUser, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { cards, initializeStore } = useGameStore();
  const { createCharacter, login } = usePlayerStore();
  
  const [currentTab, setCurrentTab] = useState<'create' | 'login'>('create');
  const [characterName, setCharacterName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Initialize store when component mounts
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Filter only 1-star cards
  const starterCards = cards.filter(card => card.starLevel === 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentTab === 'create') {
      if (!characterName || !username || !password || !confirmPassword || !selectedCard) {
        alert('Please fill in all fields and select a card');
        return;
      }
      
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      const selectedCardData = cards.find(card => card.id === selectedCard);
      if (!selectedCardData) {
        alert('Please select a valid card');
        return;
      }

      // Create character with the card's image URL
      createCharacter(characterName, selectedCard, selectedCardData.imageUrl);
      login(username); // This will set isAuthenticated to true
      navigate('/dashboard');
    } else {
      if (!loginUsername || !loginPassword) {
        alert('Please fill in all fields');
        return;
      }
      
      login(loginUsername);
      navigate('/dashboard');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    selected: {
      scale: 1.08,
      y: -8,
      boxShadow: "0 0 20px rgba(236,72,153,0.6)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Content */}
      <div className="relative min-h-screen py-16">
        {/* Main Glass Container */}
        <div className="container mx-auto bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-xl rounded-3xl border border-pink-500/40 overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.3)] mt-16 max-w-6xl">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] min-h-[75vh]">
            {/* Left Column - Card Selection */}
            <div className="p-5 border-r border-pink-500/20">
              {/* Character Name Input */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-pink-500/30 mb-4">
                <label className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold text-lg mb-1.5">
                  Character Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    placeholder="Enter your character's name"
                  />
                </div>
              </div>

              {/* Stylish Divider/Title */}
              <div className="text-center relative py-2 mb-4">
                <h2 className="text-2xl font-bold relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x">
                  Choose Your Card
                </h2>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3">
                <AnimatePresence>
                  {starterCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial="hidden"
                      animate={selectedCard === card.id ? "selected" : "visible"}
                      whileHover={selectedCard === card.id ? "selected" : "hover"}
                      variants={cardVariants}
                      onClick={() => setSelectedCard(card.id)}
                      onHoverStart={() => setHoveredCard(card.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden ${
                        selectedCard === card.id ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-black/50' : ''
                      }`}
                      style={{
                        transformOrigin: "center center",
                      }}
                    >
                      <div className="aspect-[9/16] rounded-xl overflow-hidden relative group">
                        {/* Card Image */}
                        <img 
                          src={card.imageUrl} 
                          alt={card.name}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Card Content */}
                        <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex justify-end">
                            <div className="p-2 bg-black/40 backdrop-blur-sm rounded-lg">
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 w-4 h-4" />
                                <span className="text-white text-sm font-bold">{card.starLevel}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">{card.name}</h3>
                            <p className="text-gray-300 text-sm">{card.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column - Auth Forms */}
            <div className="p-5 flex items-center">
              <div className="w-full max-w-sm mx-auto">
                {/* Tabs */}
                <div className="flex mb-4 bg-black/30 rounded-xl p-1">
                  <button
                    onClick={() => setCurrentTab('create')}
                    className={`flex-1 py-3 rounded-lg transition-all ${
                      currentTab === 'create' 
                        ? 'bg-pink-500/30 text-white' 
                        : 'text-pink-300 hover:bg-pink-500/10'
                    }`}
                  >
                    Create Profile
                  </button>
                  <button
                    onClick={() => setCurrentTab('login')}
                    className={`flex-1 py-3 rounded-lg transition-all ${
                      currentTab === 'login' 
                        ? 'bg-pink-500/30 text-white' 
                        : 'text-pink-300 hover:bg-pink-500/10'
                    }`}
                  >
                    Login
                  </button>
                </div>

                {/* Forms */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentTab === 'create' ? (
                        <>
                          <div>
                            <label className="block text-pink-300 mb-1 text-sm">Username</label>
                            <div className="relative">
                              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                              <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                                placeholder="Enter username"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-pink-300 mb-1 text-sm">Password</label>
                            <div className="relative">
                              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                                placeholder="Enter password"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-pink-300 mb-1 text-sm">Confirm Password</label>
                            <div className="relative">
                              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                                placeholder="Confirm password"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-pink-300 mb-1 text-sm">Username</label>
                            <div className="relative">
                              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                              <input
                                type="text"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                                placeholder="Enter username"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-pink-300 mb-1 text-sm">Password</label>
                            <div className="relative">
                              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                              <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm"
                                placeholder="Enter password"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-pink-500/25 text-sm mt-6"
                  >
                    {currentTab === 'create' ? 'Create Character' : 'Login'}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
