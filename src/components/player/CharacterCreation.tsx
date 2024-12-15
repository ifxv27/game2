import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import usePlayerStore from '../../store/1playerStore';
import { FaUser, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CharacterCreation = () => {
  const navigate = useNavigate();
  const { cards } = useGameStore();
  const { createCharacter } = usePlayerStore();
  
  const [characterName, setCharacterName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [error, setError] = useState('');

  // Filter starter cards from CardManagement
  const starterCards = cards.filter(card => card.category === 'Starter');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterName || !email || !password || !selectedCard) {
      setError('Please fill in all fields and select a starter card');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createCharacter({
        username: characterName,
        email,
        password,
        cardId: selectedCard
      });
      navigate('/play');
    } catch (error) {
      setError('Failed to create character');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
      }}>
      <div className="w-full max-w-6xl"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '2rem',
        }}>
        <h2 className="text-3xl font-bold text-center text-white mb-8">Create Your Character</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-pink-400 mb-2">Character Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-pink-500"
                  placeholder="Enter character name"
                />
              </div>
            </div>

            <div>
              <label className="block text-pink-400 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-pink-500"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label className="block text-pink-400 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-pink-500"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div>
              <label className="block text-pink-400 mb-2">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-10 text-white focus:outline-none focus:border-pink-500"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          {/* Card Selection Section */}
          <div>
            <h3 className="text-xl font-bold text-pink-400 mb-4">Choose Your Starter Card</h3>
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {starterCards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative cursor-pointer ${
                    selectedCard === card.id ? 'ring-2 ring-pink-500' : ''
                  }`}
                  onClick={() => setSelectedCard(card.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-white mb-2">{card.name}</h4>
                    <p className="text-gray-300 text-sm mb-2">{card.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(card.stats).map(([stat, value]) => (
                        <div key={stat} className="flex items-center space-x-1 text-gray-300">
                          <span className="capitalize">{stat}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedCard === card.id && (
                    <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                      <FaCheck className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium 
              hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Create Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
