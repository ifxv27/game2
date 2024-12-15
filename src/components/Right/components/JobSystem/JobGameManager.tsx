import React, { useState } from 'react';
import { Job, JobStats } from './types';
import { TimingGame } from './minigames/TimingGame';

interface JobGameManagerProps {
  job: Job;
  card: any; // Replace with your card type
  onComplete: (results: {
    success: boolean;
    stats: Partial<JobStats>;
    cardUpdates: any; // Replace with your card update type
  }) => void;
}

export const JobGameManager: React.FC<JobGameManagerProps> = ({
  job,
  card,
  onComplete,
}) => {
  const [gamePhase, setGamePhase] = useState<'intro' | 'game' | 'results'>('intro');
  const [gameScore, setGameScore] = useState(0);

  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setGamePhase('results');

    // Calculate success and rewards based on score
    const success = score >= 300; // Adjust threshold as needed
    const bonusMultiplier = Math.floor(score / 100) * 0.1 + 1; // 10% bonus per 100 points

    // Calculate stat changes
    const stats: Partial<JobStats> = {
      health: -Math.max(0, job.risks.healthRisk - (score / 100)), // Better performance = less health loss
      energy: -Math.max(0, job.risks.energyCost - (score / 150)), // Better performance = less energy drain
      money: job.rewards.basePayment * bonusMultiplier,
      experience: job.rewards.experienceGain * bonusMultiplier,
    };

    // Calculate card updates
    const cardUpdates = {
      money: card.money + stats.money,
      health: Math.max(0, card.health + (stats.health || 0)),
      energy: Math.max(0, card.energy + (stats.energy || 0)),
      experience: card.experience + stats.experience,
      // Add other card-specific updates
    };

    onComplete({ success, stats, cardUpdates });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {gamePhase === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{job.name}</h2>
          <p className="mb-4">{job.description}</p>
          <button
            onClick={() => setGamePhase('game')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Start Job
          </button>
        </div>
      )}

      {gamePhase === 'game' && (
        <TimingGame
          onComplete={handleGameComplete}
          difficulty={job.requirements.minimumLevel}
          duration={30}
        />
      )}

      {gamePhase === 'results' && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Job Complete!</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">Score: {gameScore}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-bold">Money Earned</p>
              <p className="text-green-600">
                ${(job.rewards.basePayment * (1 + gameScore/1000)).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-bold">Experience Gained</p>
              <p className="text-blue-600">
                +{(job.rewards.experienceGain * (1 + gameScore/1000)).toFixed(0)} XP
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
