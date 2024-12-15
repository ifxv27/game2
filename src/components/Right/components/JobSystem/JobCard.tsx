import React from 'react';
import { Job } from './types';
import { FaClock, FaBolt, FaHeart, FaCoins } from 'react-icons/fa';

interface JobCardProps {
  job: Job;
  onStart: (job: Job) => void;
  disabled?: boolean;
  isActive?: boolean;
  result?: {
    success: boolean;
    rewards?: {
      money: number;
      experience: number;
    }
  };
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onStart, 
  disabled,
  isActive,
  result 
}) => {
  return (
    <div 
      className={`bg-black/60 backdrop-blur-sm rounded-lg border ${
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
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-purple-300">{job.name}</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300">
              {job.category}
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-400">
              <FaCoins />
              <span>{job.rewards.basePayment}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-purple-200/70">{job.description}</p>

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
        </div>

        {result ? (
          <div className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
            <p>{result.success ? 'Completed!' : 'Failed'}</p>
            {result.rewards && (
              <div className="mt-1 space-y-1">
                <p className="flex items-center gap-1">
                  <FaCoins className="text-yellow-500" />
                  <span>{result.rewards.money} coins</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onStart(job)}
            disabled={disabled || isActive}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
              disabled || isActive
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isActive ? 'In Progress...' : disabled ? 'Not Available' : 'Start Job'}
          </button>
        )}
      </div>
    </div>
  );
};
