import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../store/1playerStore';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';
import PlayerOnboarding from './player/PlayerOnboarding';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const { login } = usePlayerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Login the user
      await login(username);
      
      // Check if user is admin/mod
      const isAdmin = username.toLowerCase() === 'admin' || username.toLowerCase() === 'mod';
      
      // Show onboarding for regular users
      if (!isAdmin) {
        setShowOnboarding(true);
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    navigate('/play', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-pink-500/40 p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500/60" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/20 border border-pink-500/20 text-white px-10 py-2 rounded-lg focus:outline-none focus:border-pink-500/40 placeholder-gray-500"
                  placeholder="Username"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-pink-500/20 text-white px-10 py-2 rounded-lg focus:outline-none focus:border-pink-500/40 placeholder-gray-500"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </motion.div>

      <PlayerOnboarding 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </div>
  );
};

export default Login;
