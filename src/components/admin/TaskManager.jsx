import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export function TaskManager() {
  const { cards, addCard, updateCard, deleteCard } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    reward: 0,
    status: 'pending',
    category: 'Job', 
    class: 'Model',
    starRank: 1,
    cardRank: 'Common',
    requirements: {
      minimumLevel: 1,
      requiredStats: {
        energy: 0,
        health: 0,
        fame: 0
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
      healthRisk: 0,
      energyCost: 0,
      reputationRisk: 0,
      failureChance: 0.1
    }
  });

  const items = cards.filter(card => card.category === 'Task' || card.category === 'Job');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      updateCard({ ...selectedTask, ...taskFormData, id: selectedTask.id });
    } else {
      addCard({ 
        ...taskFormData, 
        id: Date.now().toString(),
      });
    }
    handleCloseModal();
  };

  const handleEdit = (item) => {
    setSelectedTask(item);
    setTaskFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteCard(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setTaskFormData({
      name: '',
      description: '',
      deadline: '',
      reward: 0,
      status: 'pending',
      category: 'Job',
      class: 'Model',
      starRank: 1,
      cardRank: 'Common',
      requirements: {
        minimumLevel: 1,
        requiredStats: {
          energy: 0,
          health: 0,
          fame: 0
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
        healthRisk: 0,
        energyCost: 0,
        reputationRisk: 0,
        failureChance: 0.1
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Task & Job Manager</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-purple-400">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <p>Category: {item.category}</p>
              <p>Status: {item.status}</p>
              {item.deadline && <p>Deadline: {item.deadline}</p>}
              {item.category === 'Job' && (
                <>
                  <p>Level Required: {item.requirements?.minimumLevel || 1}</p>
                  <p>Base Payment: {item.rewards?.basePayment || 0}</p>
                  <p>Duration: {item.duration || 30} minutes</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              {selectedTask ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={taskFormData.name}
                    onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={taskFormData.category}
                    onChange={(e) => setTaskFormData({ ...taskFormData, category: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  >
                    <option value="Job">Job</option>
                    <option value="Task">Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  rows="3"
                  required
                />
              </div>

              {taskFormData.category === 'Job' ? (
                <>
                  <div className="bg-gray-900 rounded-lg p-4 space-y-4">
                    <h4 className="text-lg font-semibold text-purple-400">Job Stat Modifications</h4>
                    
                    {/* Requirements */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Minimum Level</label>
                        <input
                          type="number"
                          value={taskFormData.requirements.minimumLevel}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            requirements: { 
                              ...taskFormData.requirements, 
                              minimumLevel: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Required Energy</label>
                        <input
                          type="number"
                          value={taskFormData.requirements.requiredStats.energy}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            requirements: { 
                              ...taskFormData.requirements,
                              requiredStats: {
                                ...taskFormData.requirements.requiredStats,
                                energy: parseInt(e.target.value) 
                              }
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Required Health</label>
                        <input
                          type="number"
                          value={taskFormData.requirements.requiredStats.health}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            requirements: { 
                              ...taskFormData.requirements,
                              requiredStats: {
                                ...taskFormData.requirements.requiredStats,
                                health: parseInt(e.target.value) 
                              }
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Base Payment</label>
                        <input
                          type="number"
                          value={taskFormData.rewards.basePayment}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            rewards: { 
                              ...taskFormData.rewards, 
                              basePayment: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">XP Gain</label>
                        <input
                          type="number"
                          value={taskFormData.rewards.experienceGain}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            rewards: { 
                              ...taskFormData.rewards, 
                              experienceGain: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Bonus Chance</label>
                        <input
                          type="number"
                          value={taskFormData.rewards.bonusChance * 100}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            rewards: { 
                              ...taskFormData.rewards, 
                              bonusChance: parseFloat(e.target.value) / 100 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                          max="100"
                          step="1"
                        />
                      </div>
                    </div>

                    {/* Risks */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Health Risk</label>
                        <input
                          type="number"
                          value={taskFormData.risks.healthRisk}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            risks: { 
                              ...taskFormData.risks, 
                              healthRisk: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Energy Cost</label>
                        <input
                          type="number"
                          value={taskFormData.risks.energyCost}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            risks: { 
                              ...taskFormData.risks, 
                              energyCost: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Failure Chance</label>
                        <input
                          type="number"
                          value={taskFormData.risks.failureChance * 100}
                          onChange={(e) => setTaskFormData({ 
                            ...taskFormData, 
                            risks: { 
                              ...taskFormData.risks, 
                              failureChance: parseFloat(e.target.value) / 100 
                            } 
                          })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          min="0"
                          max="100"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={taskFormData.duration}
                        onChange={(e) => setTaskFormData({
                          ...taskFormData,
                          duration: parseInt(e.target.value)
                        })}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Cooldown (minutes)</label>
                      <input
                        type="number"
                        value={taskFormData.cooldown}
                        onChange={(e) => setTaskFormData({
                          ...taskFormData,
                          cooldown: parseInt(e.target.value)
                        })}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        min="0"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Deadline</label>
                    <input
                      type="datetime-local"
                      value={taskFormData.deadline}
                      onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Status</label>
                    <select
                      value={taskFormData.status}
                      onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                  {selectedTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;
