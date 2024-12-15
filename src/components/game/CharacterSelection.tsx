import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import usePlayerStore from '../../store/1playerStore';
import { FaStar, FaBolt, FaHeart, FaShieldAlt } from 'react-icons/fa';
import styles from './CharacterSelection.module.css';

const CharacterSelection: React.FC = () => {
  const { characterImages, selectCharacterImage, selectedImageIndex, setSelectedCharacter } = useGameStore();
  const { setActiveCharacter } = usePlayerStore();
  const [characterName, setCharacterName] = useState('');
  const [selectedClass, setSelectedClass] = useState('warrior');

  const handleCreateCharacter = () => {
    if (!characterName.trim()) {
      alert('Please enter a character name');
      return;
    }

    const newCharacter = {
      id: `char-${Date.now()}`,
      name: characterName,
      class: selectedClass,
      className: selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1),
      imageUrl: characterImages[selectedImageIndex] || '/default-character.jpg',
      starRank: 1,
      stats: {
        power: selectedClass === 'warrior' ? 8 : selectedClass === 'mage' ? 6 : 7,
        energy: selectedClass === 'mage' ? 12 : 10,
        health: selectedClass === 'warrior' ? 12 : 8,
        defense: selectedClass === 'warrior' ? 10 : selectedClass === 'mage' ? 6 : 8
      }
    };

    setSelectedCharacter(newCharacter);
    setActiveCharacter(newCharacter.id);
  };

  const characterClasses = [
    {
      id: 'warrior',
      name: 'Warrior',
      description: 'Strong and durable, excels in close combat',
      stats: { power: 8, energy: 10, health: 12, defense: 10 }
    },
    {
      id: 'mage',
      name: 'Mage',
      description: 'Masters of magic with powerful spells',
      stats: { power: 6, energy: 12, health: 8, defense: 6 }
    },
    {
      id: 'rogue',
      name: 'Rogue',
      description: 'Quick and agile, specializes in stealth',
      stats: { power: 7, energy: 10, health: 8, defense: 8 }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl border border-pink-500/40 p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-8">Create Your Character</h2>

        {/* Character Name Input */}
        <div className="mb-8">
          <label className="block text-white mb-2">Character Name</label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full bg-black/20 border border-pink-500/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-pink-500/40"
            placeholder="Enter character name"
          />
        </div>

        {/* Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {characterClasses.map((charClass) => (
            <motion.div
              key={charClass.id}
              whileHover={{ scale: 1.02 }}
              className={`${styles.playerCard} cursor-pointer`}
              onClick={() => setSelectedClass(charClass.id)}
            >
              {/* Box Effect */}
              <div className={styles.boxBackground}></div>
              <div className={styles.boxBorder}></div>
              
              <div className={styles.cardContent}>
                <div className={styles.imageContainer}>
                  <img 
                    src={characterImages[selectedImageIndex]} 
                    alt={charClass.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayHeader}>
                      <h3 className={styles.name}>{charClass.name}</h3>
                      <p className="text-gray-300 text-sm">{charClass.description}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.contentContainer}>
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <span>Power</span>
                      <span className="font-bold">{charClass.stats.power}</span>
                    </div>
                    <div className={styles.stat}>
                      <span>Energy</span>
                      <span className="font-bold">{charClass.stats.energy}</span>
                    </div>
                    <div className={styles.stat}>
                      <span>Health</span>
                      <span className="font-bold">{charClass.stats.health}</span>
                    </div>
                    <div className={styles.stat}>
                      <span>Defense</span>
                      <span className="font-bold">{charClass.stats.defense}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Character Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Character Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 rounded-xl p-6 border border-pink-500/20">
              <div className="aspect-square rounded-xl overflow-hidden mb-4">
                <img
                  src={characterImages[selectedImageIndex] || '/default-character.jpg'}
                  alt="Character Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => selectCharacterImage((selectedImageIndex - 1 + characterImages.length) % characterImages.length)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => selectCharacterImage((selectedImageIndex + 1) % characterImages.length)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateCharacter}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-bold text-lg"
        >
          Create Character
        </button>
      </motion.div>
    </div>
  );
};

export default CharacterSelection;
