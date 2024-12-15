import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaBolt, FaHeart, FaCoins, FaStar } from 'react-icons/fa';
import { Job } from './types';

interface JobCardProps {
  job: Job;
  isActive: boolean;
  canStart: boolean;
  onStart: () => void;
  result?: any;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isActive,
  canStart,
  onStart,
  result
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative bg-black/60 backdrop-blur-sm rounded-lg border ${
        isActive 
          ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
          : result
          ? result.success
            ? 'border-green-500/50 shadow-lg shadow-green-500/20'
            : 'border-red-500/50 shadow-lg shadow-red-500/20'
          : 'border-purple-500/30 hover:border-purple-500/50'
      } p-4 transition-all duration-200`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-purple-300">{job.name}</h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300">
            {job.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-purple-200/70">{job.description}</p>

        {/* Requirements */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <FaBolt className="text-yellow-500" />
            <span className="text-purple-200">Energy: {job.requirements.requiredStats.energy}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500" />
            <span className="text-purple-200">Health: {job.requirements.requiredStats.health}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-blue-500" />
            <span className="text-purple-200">{job.duration}s</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCoins className="text-yellow-500" />
            <span className="text-purple-200">{job.rewards.basePayment}</span>
          </div>
        </div>

        {/* Game Type */}
        {job.gameType && (
          <div className="text-sm text-purple-300">
            <span className="font-semibold">Game Type:</span> {job.gameType}
          </div>
        )}

        {/* Result or Action */}
        {result ? (
          <div className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
            <p>{result.success ? 'Completed!' : 'Failed'}</p>
            {result.rewards && (
              <div className="mt-1 space-y-1">
                <p className="flex items-center gap-1">
                  <FaCoins className="text-yellow-500" />
                  <span>{result.rewards.money} coins</span>
                </p>
                <p className="flex items-center gap-1">
                  <FaStar className="text-purple-500" />
                  <span>{result.rewards.experience} XP</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onStart}
            disabled={!canStart || isActive}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
              !canStart || isActive
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isActive ? 'In Progress...' : canStart ? 'Start Job' : 'Not Available'}
          </button>
        )}
      </div>
    </motion.div>
  );
};
