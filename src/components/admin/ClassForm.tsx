import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface BaseStats {
  power: number;
  defense: number;
  speed: number;
  health: number;
  energy: number;
}

interface SkillProgression {
  level: number;
  skill: string;
  description: string;
}

interface ClassFormProps {
  initialClass?: any;
  onSubmit: (classData: any) => void;
  onCancel: () => void;
}

export function ClassForm({ initialClass, onSubmit, onCancel }: ClassFormProps) {
  const [formData, setFormData] = useState({
    id: initialClass?.id || '',
    name: initialClass?.name || '',
    description: initialClass?.description || '',
    baseStats: initialClass?.baseStats || {
      power: 0,
      defense: 0,
      speed: 0,
      health: 100,
      energy: 100
    },
    skillProgression: initialClass?.skillProgression || [],
    growthRates: initialClass?.growthRates || {
      power: 1,
      defense: 1,
      speed: 1,
      health: 10,
      energy: 5
    },
    specialAbilities: initialClass?.specialAbilities || [],
    requirements: initialClass?.requirements || {
      level: 1,
      items: [],
      quests: []
    }
  });

  const [newSkill, setNewSkill] = useState({
    level: 1,
    skill: '',
    description: ''
  });

  const [newAbility, setNewAbility] = useState('');

  const handleStatChange = (stat: keyof BaseStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      baseStats: {
        ...prev.baseStats,
        [stat]: numValue
      }
    }));
  };

  const handleGrowthRateChange = (stat: keyof BaseStats, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      growthRates: {
        ...prev.growthRates,
        [stat]: numValue
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.skill && newSkill.description) {
      setFormData(prev => ({
        ...prev,
        skillProgression: [...prev.skillProgression, { ...newSkill }]
      }));
      setNewSkill({ level: 1, skill: '', description: '' });
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillProgression: prev.skillProgression.filter((_, i) => i !== index)
    }));
  };

  const handleAddAbility = () => {
    if (newAbility.trim()) {
      setFormData(prev => ({
        ...prev,
        specialAbilities: [...prev.specialAbilities, newAbility.trim()]
      }));
      setNewAbility('');
    }
  };

  const handleRemoveAbility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialAbilities: prev.specialAbilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: formData.id || `class-${Date.now()}`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        {initialClass ? 'Edit Class' : 'Create New Class'}
      </h2>
      
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Class Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white
                     focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g., Warrior, Mage, Rogue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white
                     focus:outline-none focus:border-purple-500 transition-colors"
            rows={3}
            placeholder="Describe the class's characteristics and playstyle..."
            required
          />
        </div>
      </div>

      {/* Base Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Base Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.baseStats).map(([stat, value]) => (
            <div key={stat}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {stat}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleStatChange(stat as keyof BaseStats, e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Growth Rates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Growth Rates (per level)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.growthRates).map(([stat, value]) => (
            <div key={stat}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {stat} Growth
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleGrowthRateChange(stat as keyof BaseStats, e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                min="0"
                step="0.1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Skill Progression */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Skill Progression</h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 1 })}
            className="w-24 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            placeholder="Level"
            min="1"
          />
          <input
            type="text"
            value={newSkill.skill}
            onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            placeholder="Skill name"
          />
          <input
            type="text"
            value={newSkill.description}
            onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            placeholder="Description"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Add Skill
          </button>
        </div>
        <div className="space-y-2">
          {formData.skillProgression.map((skill, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
              <div className="flex-1">
                <span className="text-purple-400">Level {skill.level}:</span>{' '}
                <span className="text-white font-medium">{skill.skill}</span>{' '}
                <span className="text-gray-300">- {skill.description}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Abilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Special Abilities</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={newAbility}
            onChange={(e) => setNewAbility(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            placeholder="Enter special ability"
          />
          <button
            type="button"
            onClick={handleAddAbility}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Add Ability
          </button>
        </div>
        <div className="space-y-2">
          {formData.specialAbilities.map((ability, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
              <span className="text-white">{ability}</span>
              <button
                type="button"
                onClick={() => handleRemoveAbility(index)}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          {initialClass ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
}
