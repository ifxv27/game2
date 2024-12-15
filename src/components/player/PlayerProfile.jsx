import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaCog, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';

const PlayerProfile = ({ isHero = false, onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const { 
    currentPlayer, 
    createPlayer, 
    loginPlayer, 
    logoutPlayer, 
    isAuthenticated 
  } = usePlayerStore();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        
        const result = await createPlayer({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (!result.success) {
          setError(result.error);
          return;
        }

        onSuccess();
      } else {
        // Login
        const result = await loginPlayer(formData.username, formData.password);
        if (!result.success) {
          setError(result.error);
          return;
        }

        // Check if admin login was successful
        if (currentPlayer.role === 'admin' || currentPlayer.role === 'moderator') {
          navigate('/admin');
          return;
        }

        // Handle other user routing
        if (currentPlayer.hasStarterCard) {
          navigate('/game');
        } else {
          // Redirect to character creation if no starter card
          navigate('/character-creation');
        }

        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logoutPlayer();
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (isAuthenticated && currentPlayer) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FaUser className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {currentPlayer.username}
              </h2>
              <p className="text-sm text-purple-400">{currentPlayer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentPlayer.role === 'admin' && (
              <button
                onClick={() => window.location.href = '/admin'}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                title="Admin Dashboard"
              >
                <FaCog size={18} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>

        <div className="text-center text-purple-300">
          <p>Select a character and start your journey!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6 ${isHero ? 'h-full' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-purple-300">
            {isRegistering
              ? 'Create a new account to start your journey'
              : 'Login to continue your adventure'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-purple-300 text-sm font-medium mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 pl-10 pr-4 text-purple-200 placeholder-purple-500/50 focus:outline-none focus:border-purple-500/50"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-purple-300 text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 pl-10 pr-4 text-purple-200 placeholder-purple-500/50 focus:outline-none focus:border-purple-500/50"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-purple-300 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 pl-10 pr-4 text-purple-200 placeholder-purple-500/50 focus:outline-none focus:border-purple-500/50"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-purple-300 text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg py-2 pl-10 pr-4 text-purple-200 placeholder-purple-500/50 focus:outline-none focus:border-purple-500/50"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transform transition-all duration-300 hover:scale-105"
        >
          {isRegistering ? 'Create Account' : 'Login'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
              });
            }}
            className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            {isRegistering
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerProfile;
