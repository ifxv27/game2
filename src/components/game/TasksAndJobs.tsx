import React from 'react';
import { FaClock, FaCoins, FaStar, FaBolt, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { useGameStore } from '../../store/gameStore';
import usePlayerStore from '../../store/playerStore';

const TasksAndJobs = () => {
  const { tasks } = useGameStore();
  const { currentPlayer } = usePlayerStore();

  const canPlayerDoTask = (task: any) => {
    if (!currentPlayer) return false;
    const { health, energy } = currentPlayer.stats || { health: 100, energy: 100 };
    const { requiredStats, minimumLevel } = task.requirements;
    
    return health >= requiredStats.health && 
           energy >= requiredStats.energy && 
           (currentPlayer.stats?.level || 1) >= minimumLevel;
  };

  const getTimeLeft = (lastCompleted: number, cooldown: number) => {
    if (!lastCompleted) return 'Ready';
    const now = Date.now();
    const timeLeft = (lastCompleted + cooldown) - now;
    if (timeLeft <= 0) return 'Ready';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {tasks.map((task) => {
          const timeLeft = getTimeLeft(task.lastCompleted, task.cooldown);
          const isAvailable = timeLeft === 'Ready' && canPlayerDoTask(task);
          
          return (
            <div
              key={task.id}
              className={`bg-black/40 rounded-lg p-6 border ${
                isAvailable ? 'border-purple-500/20 hover:border-purple-500/40' : 'border-gray-700'
              } transition-colors`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{task.name}</h3>
                  <p className="text-gray-400 mb-4">{task.description}</p>
                  
                  {/* Requirements */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaHeart className="text-red-500" />
                      <span className="text-red-500">{task.requirements.requiredStats.health} HP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBolt className="text-yellow-500" />
                      <span className="text-yellow-500">{task.requirements.requiredStats.energy} EN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-blue-500" />
                      <span className="text-blue-500">Lvl {task.requirements.minimumLevel}</span>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FaCoins className="text-yellow-500" />
                      <span className="text-yellow-500">{task.rewards.basePayment}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar className="text-purple-500" />
                      <span className="text-purple-500">{task.rewards.experienceGain} XP</span>
                    </div>
                  </div>
                </div>

                {/* Time and Status */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <FaClock className={timeLeft === 'Ready' ? 'text-green-500' : 'text-gray-500'} />
                    <span className={timeLeft === 'Ready' ? 'text-green-500' : 'text-gray-500'}>
                      {timeLeft}
                    </span>
                  </div>
                  <button
                    className={`px-4 py-2 rounded ${
                      isAvailable
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isAvailable}
                  >
                    Start Task
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksAndJobs;
