import React, { useState, useEffect } from 'react';
import { Job } from '../game/jobs/types';

interface TaskFormProps {
  initialData?: Job;
  onSubmit: (taskData: Omit<Job, 'id'>) => void;
  onCancel: () => void;
}

export function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Job, 'id'>>({
    name: '',
    category: 'Basic',
    description: '',
    requirements: {
      minimumLevel: 1,
      requiredStats: {
        energy: 20,
        health: 30
      }
    },
    duration: 30,
    cooldown: 60,
    rewards: {
      basePayment: 100,
      bonusChance: 0.3,
      experienceGain: 25,
      itemDropChance: 0.1,
      cardRollChance: 0.05
    },
    risks: {
      healthRisk: 10,
      energyCost: 20,
      reputationRisk: 0,
      failureChance: 0.2
    },
    gameType: 'memory'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Basic">Basic</option>
              <option value="Combat">Combat</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Exploration">Exploration</option>
              <option value="Social">Social</option>
              <option value="Training">Training</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Minimum Level</label>
            <input
              type="number"
              value={formData.requirements.minimumLevel}
              onChange={(e) => setFormData({
                ...formData,
                requirements: {
                  ...formData.requirements,
                  minimumLevel: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Required Energy</label>
              <input
                type="number"
                value={formData.requirements.requiredStats.energy}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: {
                    ...formData.requirements,
                    requiredStats: {
                      ...formData.requirements.requiredStats,
                      energy: parseInt(e.target.value)
                    }
                  }
                })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Required Health</label>
              <input
                type="number"
                value={formData.requirements.requiredStats.health}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: {
                    ...formData.requirements,
                    requiredStats: {
                      ...formData.requirements.requiredStats,
                      health: parseInt(e.target.value)
                    }
                  }
                })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rewards and Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-purple-400">Rewards</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Base Payment</label>
            <input
              type="number"
              value={formData.rewards.basePayment}
              onChange={(e) => setFormData({
                ...formData,
                rewards: {
                  ...formData.rewards,
                  basePayment: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Experience Gain</label>
            <input
              type="number"
              value={formData.rewards.experienceGain}
              onChange={(e) => setFormData({
                ...formData,
                rewards: {
                  ...formData.rewards,
                  experienceGain: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-red-400">Risks</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Health Risk</label>
            <input
              type="number"
              value={formData.risks.healthRisk}
              onChange={(e) => setFormData({
                ...formData,
                risks: {
                  ...formData.risks,
                  healthRisk: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Energy Cost</label>
            <input
              type="number"
              value={formData.risks.energyCost}
              onChange={(e) => setFormData({
                ...formData,
                risks: {
                  ...formData.risks,
                  energyCost: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Failure Chance (%)</label>
            <input
              type="number"
              value={formData.risks.failureChance * 100}
              onChange={(e) => setFormData({
                ...formData,
                risks: {
                  ...formData.risks,
                  failureChance: parseInt(e.target.value) / 100
                }
              })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Save Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
