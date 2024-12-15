import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Task {
  id: string;
  name: string;
  description: string;
  requirements: {
    requiredStats: {
      energy: number;
      health: number;
    };
    minimumLevel: number;
  };
  rewards: {
    health: number;
    energy: number;
    power: number;
    defense: number;
    experienceGain: number;
    basePayment: number;
  };
  risks: {
    healthRisk: number;
    energyCost: number;
    failureChance: number;
  };
  cooldown: number;
  lastCompleted: number;
}

export const TaskManagement: React.FC = () => {
  const { tasks = [], addTask, updateTask, deleteTask } = useGameStore();
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    name: '',
    description: '',
    requirements: {
      requiredStats: {
        energy: 0,
        health: 0
      },
      minimumLevel: 1
    },
    rewards: {
      health: 0,
      energy: 0,
      power: 0,
      defense: 0,
      experienceGain: 0,
      basePayment: 0
    },
    risks: {
      healthRisk: 0,
      energyCost: 0,
      failureChance: 0
    },
    cooldown: 0,
    lastCompleted: 0
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    const taskWithId = {
      ...newTask,
      id: Date.now().toString()
    };
    addTask(taskWithId);
    setNewTask({
      id: '',
      name: '',
      description: '',
      requirements: {
        requiredStats: {
          energy: 0,
          health: 0
        },
        minimumLevel: 1
      },
      rewards: {
        health: 0,
        energy: 0,
        power: 0,
        defense: 0,
        experienceGain: 0,
        basePayment: 0
      },
      risks: {
        healthRisk: 0,
        energyCost: 0,
        failureChance: 0
      },
      cooldown: 0,
      lastCompleted: 0
    });
  };

  const handleUpdateTask = (task: Task) => {
    updateTask(task);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Task Management</h2>

      <div className="space-y-4">
        <input
          type="text"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          placeholder="Task name"
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          className="w-full p-2 bg-gray-700 rounded text-white"
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="minimum-level"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Minimum Level
            </label>
            <input
              id="minimum-level"
              type="number"
              value={newTask.requirements.minimumLevel}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  requirements: { ...newTask.requirements, minimumLevel: parseInt(e.target.value) },
                })
              }
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label
              htmlFor="required-energy"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Required Energy
            </label>
            <input
              id="required-energy"
              type="number"
              value={newTask.requirements.requiredStats.energy}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  requirements: {
                    ...newTask.requirements,
                    requiredStats: { ...newTask.requirements.requiredStats, energy: parseInt(e.target.value) },
                  },
                })
              }
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label
              htmlFor="required-health"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Required Health
            </label>
            <input
              id="required-health"
              type="number"
              value={newTask.requirements.requiredStats.health}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  requirements: {
                    ...newTask.requirements,
                    requiredStats: { ...newTask.requirements.requiredStats, health: parseInt(e.target.value) },
                  },
                })
              }
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          {Object.keys(newTask.rewards).map((reward) => (
            <div key={reward}>
              <label
                htmlFor={`reward-${reward}`}
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                {reward.charAt(0).toUpperCase() + reward.slice(1)} Reward
              </label>
              <input
                id={`reward-${reward}`}
                type="number"
                value={newTask.rewards[reward]}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    rewards: { ...newTask.rewards, [reward]: parseInt(e.target.value) },
                  })
                }
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
            </div>
          ))}
          {Object.keys(newTask.risks).map((risk) => (
            <div key={risk}>
              <label
                htmlFor={`risk-${risk}`}
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
              </label>
              <input
                id={`risk-${risk}`}
                type="number"
                value={newTask.risks[risk]}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    risks: { ...newTask.risks, [risk]: parseInt(e.target.value) },
                  })
                }
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddTask}
          className="w-full p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {tasks?.filter(Boolean).map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold">{task.name}</h3>
            <p className="text-gray-400">{task.description}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <p>Minimum Level: {task.requirements?.minimumLevel ?? 0}</p>
              <p>Required Energy: {task.requirements?.requiredStats?.energy ?? 0}</p>
              <p>Required Health: {task.requirements?.requiredStats?.health ?? 0}</p>
              {Object.entries(task.rewards ?? {}).map(([reward, value]) => (
                <p key={reward}>
                  {reward}: {value}
                </p>
              ))}
              {Object.entries(task.risks ?? {}).map(([risk, value]) => (
                <p key={risk}>
                  {risk}: {value}
                </p>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setEditingTask(task)}
                className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Edit Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingTask.name}
                onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
              <textarea
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded text-white"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="minimum-level"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Minimum Level
                  </label>
                  <input
                    id="minimum-level"
                    type="number"
                    value={editingTask.requirements.minimumLevel}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        requirements: { ...editingTask.requirements, minimumLevel: parseInt(e.target.value) },
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="required-energy"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Required Energy
                  </label>
                  <input
                    id="required-energy"
                    type="number"
                    value={editingTask.requirements.requiredStats.energy}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        requirements: {
                          ...editingTask.requirements,
                          requiredStats: { ...editingTask.requirements.requiredStats, energy: parseInt(e.target.value) },
                        },
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="required-health"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Required Health
                  </label>
                  <input
                    id="required-health"
                    type="number"
                    value={editingTask.requirements.requiredStats.health}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        requirements: {
                          ...editingTask.requirements,
                          requiredStats: { ...editingTask.requirements.requiredStats, health: parseInt(e.target.value) },
                        },
                      })
                    }
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>
                {Object.keys(editingTask.rewards || {}).map((reward) => (
                  <div key={reward}>
                    <label
                      htmlFor={`edit-reward-${reward}`}
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      {reward.charAt(0).toUpperCase() + reward.slice(1)} Reward
                    </label>
                    <input
                      id={`edit-reward-${reward}`}
                      type="number"
                      value={editingTask.rewards[reward]}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          rewards: { ...editingTask.rewards, [reward]: parseInt(e.target.value) },
                        })
                      }
                      className="w-full p-2 bg-gray-700 rounded text-white"
                    />
                  </div>
                ))}
                {Object.keys(editingTask.risks || {}).map((risk) => (
                  <div key={risk}>
                    <label
                      htmlFor={`edit-risk-${risk}`}
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                    </label>
                    <input
                      id={`edit-risk-${risk}`}
                      type="number"
                      value={editingTask.risks[risk]}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          risks: { ...editingTask.risks, [risk]: parseInt(e.target.value) },
                        })
                      }
                      className="w-full p-2 bg-gray-700 rounded text-white"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUpdateTask(editingTask)}
                className="w-full p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
              >
                Update Task
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="w-full p-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
