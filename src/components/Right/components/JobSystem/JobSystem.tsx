import React, { useState } from 'react';
import { Job, JobStats } from './types';
import { jobs } from './jobData';
import { JobCard } from './JobCard';
import { useGameStore } from "../../../../store/gameStore";
import { useCards } from "../../../../hooks/useCards";
import { TaskWithGame, Task } from './TaskWithGame';
import { GameType } from './minigames/types';

interface JobSystemProps {
  playerStats: JobStats;
  onJobComplete: (results: {
    stats: Partial<JobStats>;
    rewards: {
      money: number;
      experience: number;
      items?: string[];
      cardRoll?: boolean;
    };
  }) => void;
}

export const JobSystem: React.FC<JobSystemProps> = ({ playerStats, onJobComplete }) => {
  const [activeJobs, setActiveJobs] = useState<string[]>([]);
  const [jobResults, setJobResults] = useState<Record<string, any>>({});
  const [selectedJob, setSelectedJob] = useState<Task | null>(null);
  const { addNotification } = useGameStore();
  const { playerCards } = useCards();

  const canStartJob = (job: Job): boolean => {
    if (activeJobs.includes(job.id)) return false;
    if (playerStats.energy < job.requirements.requiredStats.energy!) return false;
    if (playerStats.health < job.requirements.requiredStats.health!) return false;
    return true;
  };

  const handleTaskComplete = (taskId: string, updates: any) => {
    const job = jobs.find(j => j.id === taskId);
    if (!job) return;

    const result = {
      success: true,
      stats: {
        energy: -job.risks.energyCost,
        health: -job.risks.healthRisk
      },
      rewards: {
        money: job.rewards.basePayment,
        experience: job.rewards.experienceGain,
        cardRoll: Math.random() < (job.rewards.cardRollChance || 0)
      }
    };

    setJobResults(prev => ({
      ...prev,
      [job.id]: result
    }));

    onJobComplete(result);
    
    addNotification({
      type: 'success',
      message: `Job completed! Earned ${result.rewards.money} coins and ${result.rewards.experience} XP`
    });

    setActiveJobs(prev => prev.filter(id => id !== job.id));
  };

  const startJob = async (job: Job) => {
    if (!canStartJob(job)) {
      addNotification({
        type: 'error',
        message: 'You don\'t meet the requirements for this job!'
      });
      return;
    }

    setActiveJobs(prev => [...prev, job.id]);

    // Convert job to task format for TaskWithGame
    const taskConfig: Task = {
      id: job.id,
      name: job.name,
      description: job.description,
      gameType: (job.gameType as GameType) || 'none',
      gameConfig: {
        difficulty: job.requirements.minimumLevel,
        duration: job.duration,
        targetScore: 100,
        customSettings: {}
      },
      rewards: {
        basePayment: job.rewards.basePayment,
        experienceGain: job.rewards.experienceGain,
        skillGains: {},
        items: []
      },
      requirements: {
        minimumEnergy: job.requirements.requiredStats.energy,
        minimumHealth: job.requirements.requiredStats.health,
        minimumLevel: job.requirements.minimumLevel,
        requiredSkills: {}
      }
    };

    setSelectedJob(taskConfig);
  };

  return (
    <div>
      {selectedJob ? (
        <TaskWithGame
          task={selectedJob}
          playerCards={playerCards}
          onTaskComplete={(updates) => {
            handleTaskComplete(selectedJob.id, updates);
            setSelectedJob(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onStart={startJob}
              disabled={!canStartJob(job)}
              isActive={activeJobs.includes(job.id)}
              result={jobResults[job.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
