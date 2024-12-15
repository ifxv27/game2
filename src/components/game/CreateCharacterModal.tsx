import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/1playerStore';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../types/card';
import { toast } from 'react-toastify';
import { FaStar, FaChartBar } from 'react-icons/fa';
import { starterCards } from '../../data/starterCards';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({ isOpen, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [characterName, setCharacterName] = useState('');
  const { createCharacter } = usePlayerStore();

  const handleCreateCharacter = () => {
    if (!starterCards.length) {
      toast.error('No starter cards available. Please contact an admin.');
      return;
    }
    
    if (selectedCard && characterName.trim()) {
      createCharacter(characterName, selectedCard.id, selectedCard.imageUrl);
      onClose();
    } else {
      if (!characterName.trim()) {
        toast.error('Please enter a character name');
      } else if (!selectedCard) {
        toast.error('Please select a starter card');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-gray-800/90 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Your Character</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Character Name Input */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">Character Name</label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your character's name"
            />
          </div>

          {/* Card Selection */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">Select Your Starting Card</label>
            {starterCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {starterCards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCard(card)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border ${
                      selectedCard?.id === card.id
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="aspect-w-3 aspect-h-4">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold text-lg">{card.name}</h3>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-white">{card.starLevel}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{card.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(card.stats || {}).map(([stat, value]) => (
                            <div key={stat} className="flex items-center bg-black/30 rounded px-2 py-1">
                              <FaChartBar className="text-blue-400 mr-2" />
                              <span className="text-gray-300 capitalize text-sm">{stat}</span>
                              <span className="text-white font-medium ml-auto">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-700/30 rounded-lg">
                <p className="text-gray-400">No starter cards available</p>
                <p className="text-sm text-gray-500 mt-2">Please contact an administrator</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCharacter}
              disabled={!selectedCard || !characterName.trim()}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                selectedCard && characterName.trim()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Create Character
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateCharacterModal;
