import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../store/1playerStore';
import { useGameStore } from '../store/gameStore';
import { FaUser, FaLock, FaEnvelope, FaGamepad, FaGraduationCap, FaTrophy } from 'react-icons/fa';
import styles from './player/Player.module.css';
import backgroundImage from '../components/ui/797270145169939246.png';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = usePlayerStore();
  const { activePlayers, totalMatches, totalCards, onlinePlayers } = useGameStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/play');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative" 
         style={{ 
           backgroundImage: `url(${backgroundImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative h-full w-full flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-lg shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome to the Game</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
              >
                Start Playing
              </button>
            </form>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-700/50 rounded">
                <div className="text-2xl font-bold text-blue-400">{onlinePlayers || 0}</div>
                <div className="text-gray-400">Online Players</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded">
                <div className="text-2xl font-bold text-green-400">{totalMatches || 0}</div>
                <div className="text-gray-400">Total Matches</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
