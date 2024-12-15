import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import bgImage from '../components/ui/797270145169939246.png';
import { FaUserPlus, FaGamepad, FaHeart, FaStar, FaShieldAlt, FaBolt } from 'react-icons/fa';
import { useGameStore } from '../store/gameStore';
import { usePlayer } from '../context/PlayerContext';

interface LoginForm {
  username: string;
  password: string;
}

interface NewPlayerForm {
  username: string;
  password: string;
  selectedCard: string | null;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: ''
  });
  const [newPlayerForm, setNewPlayerForm] = useState<NewPlayerForm>({
    username: '',
    password: '',
    selectedCard: null
  });

  const { cards } = useGameStore();
  const { createPlayer, setPlayer } = usePlayer();

  // Filter starter cards
  const starterCards = cards.filter(card => 
    card.category?.toLowerCase() === 'starter' || 
    card.category?.toLowerCase() === 'starter cards'
  ).slice(0, 4); // Only show 4 starter cards

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlayerForm.username || !newPlayerForm.password || !newPlayerForm.selectedCard) {
      toast.error('Please fill in all fields and select a starter card');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/players/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newPlayerForm.username,
          password: newPlayerForm.password,
          cardId: newPlayerForm.selectedCard,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set the player in context
        setPlayer(data.player);
        
        // Store the token
        localStorage.setItem('token', data.token);
        
        // Store initial player state
        localStorage.setItem('player', JSON.stringify(data.player));
        
        toast.success('Account created successfully!');
        navigate('/play');
      } else {
        toast.error(data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account. Please try again.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.username || !loginForm.password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/players/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set the player in context
        setPlayer(data.player);
        
        // Store the token
        localStorage.setItem('token', data.token);
        
        // Store player state
        localStorage.setItem('player', JSON.stringify(data.player));
        
        toast.success('Login successful!');
        navigate('/play');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Failed to log in. Please try again.');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Title */}
          <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Welcome to WHO
          </h1>

          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Character Creation */}
            <div className="relative group rounded-3xl overflow-hidden lg:col-span-3">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-all duration-500" />
              <div className="relative p-6 backdrop-blur-xl bg-black/40 border border-pink-500/20 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <FaUserPlus className="text-3xl text-pink-500" />
                  <h2 className="text-xl font-bold text-white">Create Your Character</h2>
                </div>

                {/* Character Creation Form */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Side - Character Info */}
                  <div className="space-y-4 lg:col-span-1">
                    <div>
                      <label className="block text-gray-300 mb-2">Username</label>
                      <input
                        type="text"
                        value={newPlayerForm.username}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, username: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/60 border border-pink-500/20 rounded-xl focus:border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-300 placeholder-gray-500"
                        placeholder="Choose your username"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        value={newPlayerForm.password}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, password: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/60 border border-pink-500/20 rounded-xl focus:border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-300 placeholder-gray-500"
                        placeholder="Create a password"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/40 p-3 rounded-xl border border-pink-500/10">
                        <div className="flex items-center space-x-2 text-pink-400 mb-1 text-sm">
                          <FaBolt />
                          <span>Attack</span>
                        </div>
                        <span className="text-xl font-bold text-white">10</span>
                      </div>
                      <div className="bg-gray-800/40 p-3 rounded-xl border border-pink-500/10">
                        <div className="flex items-center space-x-2 text-purple-400 mb-1 text-sm">
                          <FaShieldAlt />
                          <span>Defense</span>
                        </div>
                        <span className="text-xl font-bold text-white">10</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Starter Cards */}
                  <div className="lg:col-span-4">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Choose Your Starter Card</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {starterCards.map((card) => (
                        <motion.div
                          key={card.id}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setNewPlayerForm({ ...newPlayerForm, selectedCard: card.id })}
                          className={`relative cursor-pointer rounded-xl overflow-hidden ${
                            newPlayerForm.selectedCard === card.id
                              ? 'ring-4 ring-pink-500 ring-offset-4 ring-offset-gray-900'
                              : 'ring-1 ring-pink-500/50'
                          }`}
                        >
                          {/* Star Rating */}
                          <div className="absolute top-2 right-2 z-20 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
                            {[...Array(card.starRank || 1)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ))}
                          </div>

                          {/* Card Image */}
                          <div className="relative h-44">
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                          </div>

                          {/* Card Content */}
                          <div className="relative bg-gray-900/90 p-3 border-t border-pink-500/20">
                            <h4 className="text-white font-semibold mb-1 truncate">{card.name}</h4>
                            
                            {/* Card Type */}
                            <div className="inline-block bg-pink-500/20 text-pink-400 text-xs px-2 py-0.5 rounded-full mb-2">
                              {card.type || 'Starter Card'}
                            </div>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center text-pink-400">
                                  <FaBolt className="mr-1" /> {card.stats?.attack || 10}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center text-purple-400">
                                  <FaShieldAlt className="mr-1" /> {card.stats?.defense || 10}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center text-green-400">
                                  <FaHeart className="mr-1" /> {card.stats?.health || 100}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center text-blue-400">
                                  <FaBolt className="mr-1" /> {card.stats?.energy || 100}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          {newPlayerForm.selectedCard === card.id && (
                            <div className="absolute top-2 left-2 z-20 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                              Selected
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <button
                      onClick={handleCreateAccount}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Create Character
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Section */}
            <div className="relative group rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500" />
              <div className="relative p-6 backdrop-blur-xl bg-black/40 border border-purple-500/20 h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <FaGamepad className="text-3xl text-purple-500" />
                  <h2 className="text-xl font-bold text-white">Login</h2>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Username</label>
                      <input
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/60 border border-pink-500/20 rounded-xl focus:border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-300 placeholder-gray-500"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/60 border border-pink-500/20 rounded-xl focus:border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-300 placeholder-gray-500"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Start Playing
                  </button>
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
