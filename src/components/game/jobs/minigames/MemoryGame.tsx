import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaClock, FaTrophy, FaTimes } from 'react-icons/fa';

interface MemoryGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, onClose }) => {
  const [cards, setCards] = useState<number[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    startGame();
  }, []); // Start game when component mounts

  const startGame = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i);
    const pairs = [...numbers, ...numbers];
    setCards(shuffleArray(pairs));
    setGameStarted(true);
    setTimeElapsed(0);
    setMoves(0);
    setMatchedPairs([]);
    setFlippedIndices([]);
    setGameComplete(false);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameComplete]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === 8 && !gameComplete) {
      setGameComplete(true);
      const maxMoves = 16; // Perfect game would be 8 pairs in 8 moves
      const maxTime = 30; // Perfect time would be 30 seconds or less
      const moveScore = Math.max(0, 100 - ((moves - maxMoves) * 5)); // Lose 5 points per extra move
      const timeScore = Math.max(0, 100 - ((timeElapsed - maxTime) * 2)); // Lose 2 points per extra second
      const finalScore = Math.floor((moveScore + timeScore) / 2);
      onComplete(finalScore);
    }
  }, [matchedPairs, moves, timeElapsed, gameComplete, onComplete]);

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 || // Don't allow more than 2 cards flipped
      flippedIndices.includes(index) || // Don't allow same card to be flipped
      matchedPairs.includes(cards[index]) // Don't allow matched cards to be flipped
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (cards[firstIndex] === cards[secondIndex]) {
        // Match found
        setMatchedPairs(prev => [...prev, cards[firstIndex]]);
        setFlippedIndices([]);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const shuffleArray = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Memory Game</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {cards.map((card, index) => (
            <motion.button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-lg ${
                flippedIndices.includes(index) || matchedPairs.includes(card)
                  ? 'bg-purple-600'
                  : 'bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {(flippedIndices.includes(index) || matchedPairs.includes(card)) && (
                <span className="text-2xl">{card + 1}</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-between text-gray-300">
          <div className="flex items-center gap-2">
            <FaClock />
            <span>{timeElapsed}s</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTrophy />
            <span>{moves} moves</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar />
            <span>{matchedPairs.length}/8 pairs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
