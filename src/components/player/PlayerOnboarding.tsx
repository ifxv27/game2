import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/1playerStore';
import { useGameStore } from '../../store/gameStore';
import { FaGamepad, FaStar, FaTrophy, FaStore, 
         FaUserCircle, FaChartLine, FaDice, FaGift } from 'react-icons/fa';
import styles from './PlayerOnboarding.module.css';

interface PlayerOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerOnboarding: React.FC<PlayerOnboardingProps> = ({ isOpen, onClose }) => {
  const { username, activeCharacter } = usePlayerStore();
  const gameStore = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to the Arena!",
      icon: <FaGamepad className="text-4xl text-blue-400" />,
      description: "Ready to begin your journey? Let's get you set up with everything you need!",
      action: "Let's Go!"
    },
    {
      title: "Choose Your Path",
      icon: <FaChartLine className="text-4xl text-purple-400" />,
      description: "Pick your starting class and get your first card deck!",
      action: "Select Class"
    },
    {
      title: "Daily Rewards",
      icon: <FaGift className="text-4xl text-green-400" />,
      description: "Complete daily quests to earn rewards and level up!",
      action: "View Quests"
    },
    {
      title: "Ready for Battle",
      icon: <FaTrophy className="text-4xl text-yellow-400" />,
      description: "Jump into your first match or practice with AI!",
      action: "Start Playing"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={styles.onboardingModal}
          >
            <div className="relative p-8 w-full max-w-2xl">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gray-800 rounded-t-lg">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  className="h-full bg-blue-500 rounded-l-lg"
                />
              </div>

              {/* Content */}
              <motion.div
                key={currentStep}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="text-center py-8"
              >
                {steps[currentStep].icon}
                <h2 className="text-3xl font-bold mt-4 mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-300 text-lg mb-8">{steps[currentStep].description}</p>
                
                <button
                  onClick={handleNext}
                  className={`${styles.actionButton} flex items-center justify-center gap-2 mx-auto`}
                >
                  {steps[currentStep].action}
                  <FaDice className="text-xl" />
                </button>
              </motion.div>

              {/* Step Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlayerOnboarding;
