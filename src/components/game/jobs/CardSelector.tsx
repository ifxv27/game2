import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { motion } from 'framer-motion';
import { FaCoins, FaStar } from 'react-icons/fa';

interface Job {
  id: string;
  name: string;
  description: string;
  baseReward: number;
  cooldown: number;
  lastCompleted?: number;
}

interface Props {
  onStartJob: (job: Job) => void;
  jobs: Job[];
  canStartJob: (job: Job) => boolean;
}

export const CardSelector: React.FC<Props> = ({ onStartJob, jobs, canStartJob }) => {
  const {
    playerProfile,
    setPlayerProfile,
  } = useGameStore();

  // Get the character's selected card
  const character = playerProfile?.character;
  const characterCard = character?.selectedCard;

  if (!character) {
    return (
      <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center text-gray-400">
        No character selected. Please select a character first.
      </div>
    );
  }

  if (!characterCard) {
    return (
      <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center text-gray-400">
        No card available. Please select a card for your character.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{characterCard.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">
              {Array(characterCard.starRank).fill('⭐').join('')}
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-4">{characterCard.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <FaCoins className="text-yellow-500" />
            <span className="text-gray-300">Level {characterCard.level || 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-500" />
            <span className="text-gray-300">Rank {characterCard.rank || 'Common'}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-purple-300">Available Jobs</h5>
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onStartJob(job)}
              disabled={!canStartJob(job)}
              className={`w-full text-left p-2 rounded text-sm ${
                canStartJob(job)
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{job.name}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <FaCoins className="text-yellow-400" />
                    {job.baseReward}
                  </span>
                  {!canStartJob(job) && <FaStar className="text-red-400" />}
                </div>
              </div>
              <div className="text-xs opacity-75">{job.description}</div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
