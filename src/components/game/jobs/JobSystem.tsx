import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { motion } from 'framer-motion';
import { FaCoins, FaStar, FaTrophy, FaPercentage, FaBolt, FaHeart } from 'react-icons/fa';
import { jobs as defaultJobs } from './jobData';
import { Job } from './types';

export const JobSystem: React.FC = () => {
  const {
    playerProfile,
    setPlayerProfile,
    updatePlayerCard,
    jobs: customJobs
  } = useGameStore();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobResult, setJobResult] = useState<string | null>(null);

  // Get the player's character directly from their profile
  const playerCard = playerProfile?.character;

  // Combine default jobs with custom jobs
  const jobs = [...defaultJobs, ...(customJobs || [])];

  const handleJobComplete = async (job: Job) => {
    if (!playerProfile?.character) return;

    const card = playerProfile.character;
    
    // Check if player meets requirements
    if (card.stats.energy < job.requirements.requiredStats.energy) {
      setJobResult("Not enough energy to perform this job!");
      return;
    }
    if (card.stats.health < job.requirements.requiredStats.health) {
      setJobResult("Not enough health to perform this job!");
      return;
    }
    if (card.level < job.requirements.minimumLevel) {
      setJobResult("Your level is too low for this job!");
      return;
    }

    // Calculate success based on failure chance
    const success = Math.random() > job.risks.failureChance;

    // Calculate rewards and penalties
    let experienceGain = success ? job.rewards.experienceGain : Math.floor(job.rewards.experienceGain * 0.2);
    let payment = success ? job.rewards.basePayment : 0;
    let healthLoss = success ? Math.floor(job.risks.healthRisk * 0.5) : job.risks.healthRisk;
    let energyLoss = job.risks.energyCost;

    // Update card stats
    const updatedCard = {
      ...card,
      stats: {
        ...card.stats,
        jobsCompleted: card.stats.jobsCompleted + 1,
        experience: card.stats.experience + experienceGain,
        health: Math.max(0, card.stats.health - healthLoss),
        energy: Math.max(0, card.stats.energy - energyLoss)
      }
    };

    // Check for level up
    const experienceNeeded = card.level * 100;
    if (updatedCard.stats.experience >= experienceNeeded) {
      updatedCard.level += 1;
      updatedCard.stats.experience -= experienceNeeded;
      updatedCard.stats.health = 100; // Restore health on level up
      updatedCard.stats.energy = 100; // Restore energy on level up
      setJobResult(`Level Up! You are now level ${updatedCard.level}!`);
    }

    // Update player profile
    const updatedProfile = {
      ...playerProfile,
      character: updatedCard,
      stats: {
        ...playerProfile.stats,
        coins: (playerProfile.stats?.coins || 0) + payment
      }
    };

    // Save changes
    await updatePlayerCard(updatedCard);
    setPlayerProfile(updatedProfile);

    // Set result message
    if (success) {
      setJobResult(`Job completed successfully! Earned ${payment} coins and ${experienceGain} XP.`);
    } else {
      setJobResult(`Job failed! Lost ${healthLoss} health and gained only ${experienceGain} XP.`);
    }

    setSelectedJob(null);
  };

  const canStartJob = (job: Job): boolean => {
    if (!playerCard || !playerCard.stats) {
      return false;
    }

    // Initialize default stats if they don't exist
    const stats = {
      energy: playerCard.stats.energy ?? 100,
      health: playerCard.stats.health ?? 100,
      level: playerCard.level ?? 1
    };

    return (
      stats.energy >= job.requirements.requiredStats.energy &&
      stats.health >= job.requirements.requiredStats.health &&
      stats.level >= job.requirements.minimumLevel
    );
  };

  if (!playerCard) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-center text-gray-400">
        No character available. Please create a character first.
      </div>
    );
  }

  if (!playerCard.stats) {
    // Initialize default stats
    const defaultStats = {
      health: 100,
      energy: 100,
      power: 10,
      defense: 5,
      experience: 0,
      jobsCompleted: 0,
      level: 1
    };

    // Update the player profile with default stats
    const updatedProfile = {
      ...playerProfile,
      character: {
        ...playerCard,
        stats: defaultStats,
      }
    };
    setPlayerProfile(updatedProfile);
    return null; // Re-render with updated stats
  }

  const startJob = (job: Job) => {
    if (canStartJob(job)) {
      setSelectedJob(job);
      handleJobComplete(job);
    }
  };

  return (
    <div className="space-y-4">
      {/* Player Card Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-lg p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{playerCard.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">
              {Array(playerCard.starRank || 1).fill('⭐').join('')}
            </span>
          </div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <FaStar className="text-yellow-500" />
            <span className="text-gray-300">Level {playerCard.level || 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBolt className="text-blue-500" />
            <span className="text-gray-300">Energy: {playerCard.stats?.energy || 100}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaHeart className="text-red-500" />
            <span className="text-gray-300">Health: {playerCard.stats?.health || 100}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaTrophy className="text-purple-500" />
            <span className="text-gray-300">Jobs: {playerCard.stats?.jobsCompleted || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCoins className="text-yellow-500" />
            <span className="text-gray-300">Coins: {playerProfile.stats?.coins || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaPercentage className="text-green-500" />
            <span className="text-gray-300">XP: {playerCard.stats?.experience || 0}</span>
          </div>
        </div>

        {/* Job Result Message */}
        {jobResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-gray-700 rounded-lg text-gray-300"
          >
            {jobResult}
          </motion.div>
        )}
      </motion.div>

      {/* Available Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700 ${
              !canStartJob(job) ? 'opacity-50' : ''
            }`}
            onClick={() => startJob(job)}
          >
            <h4 className="text-lg font-semibold text-white mb-2">{job.name}</h4>
            <p className="text-gray-400 text-sm mb-3">{job.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-blue-400">
                <FaBolt className="mr-1" />
                Energy: {job.requirements.requiredStats.energy}
              </div>
              <div className="flex items-center text-yellow-400">
                <FaCoins className="mr-1" />
                Reward: {job.rewards.basePayment}
              </div>
              <div className="flex items-center text-red-400">
                <FaHeart className="mr-1" />
                Risk: {job.risks.healthRisk}
              </div>
              <div className="flex items-center text-green-400">
                <FaStar className="mr-1" />
                XP: {job.rewards.experienceGain}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobSystem;
