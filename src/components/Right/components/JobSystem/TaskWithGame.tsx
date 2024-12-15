import React, { useState } from 'react';
import { GameSelector } from './GameSelector';
import { GameType, GameResult, CardUpdate } from './minigames/types';

export interface Task {
  id: string;
  name: string;
  description: string;
  gameType: GameType;
  gameConfig: {
    difficulty: number;
    duration: number;
    targetScore: number;
    customSettings?: Record<string, any>;
  };
  rewards: {
    basePayment: number;
    experienceGain: number;
    skillGains?: Record<string, number>;
    items?: Array<{
      itemId: string;
      chance: number;
      quantity: number;
    }>;
  };
  requirements: {
    minimumLevel?: number;
    minimumEnergy?: number;
    minimumHealth?: number;
    requiredSkills?: Record<string, number>;
  };
}

interface TaskWithGameProps {
  task: Task;
  playerCards: Array<{
    id: string;
    name: string;
    level: number;
    health: number;
    energy: number;
    skills: Record<string, number>;
    [key: string]: any;
  }>;
  onTaskComplete: (updates: CardUpdate[]) => void;
}

export const TaskWithGame: React.FC<TaskWithGameProps> = ({
  task,
  playerCards,
  onTaskComplete
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const canStartTask = (cardId: string) => {
    const card = playerCards.find(c => c.id === cardId);
    if (!card) return false;

    const meetsRequirements = 
      (!task.requirements.minimumLevel || card.level >= task.requirements.minimumLevel) &&
      (!task.requirements.minimumEnergy || card.energy >= task.requirements.minimumEnergy) &&
      (!task.requirements.minimumHealth || card.health >= task.requirements.minimumHealth) &&
      (!task.requirements.requiredSkills || Object.entries(task.requirements.requiredSkills)
        .every(([skill, level]) => (card.skills[skill] || 0) >= level));

    return meetsRequirements;
  };

  const handleGameComplete = (result: GameResult) => {
    setGameCompleted(true);
    
    if (!selectedCard) return;

    const card = playerCards.find(c => c.id === selectedCard);
    if (!card) return;

    // Calculate rewards based on performance
    const updates: CardUpdate = {
      cardId: selectedCard,
      updates: {
        money: task.rewards.basePayment * result.bonusMultiplier,
        experience: task.rewards.experienceGain * result.bonusMultiplier,
        energy: -task.requirements.minimumEnergy! * (result.success ? 0.8 : 1),
        health: -task.requirements.minimumHealth! * (result.success ? 0.8 : 1),
      }
    };

    // Add skill gains
    if (task.rewards.skillGains) {
      updates.updates.skills = {};
      Object.entries(task.rewards.skillGains).forEach(([skill, gain]) => {
        updates.updates.skills![skill] = gain * result.bonusMultiplier;
      });
    }

    // Handle item rewards
    if (task.rewards.items && result.success) {
      updates.updates.inventory = task.rewards.items
        .filter(item => Math.random() <= item.chance * result.bonusMultiplier)
        .map(item => ({
          itemId: item.itemId,
          quantity: item.quantity
        }));
    }

    onTaskComplete([updates]);
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg text-white">
      {/* Task Info */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{task.name}</h2>
        <p className="text-gray-300">{task.description}</p>
      </div>

      {/* Card Selection */}
      {!gameStarted && (
        <div className="mb-4">
          <h3 className="text-xl mb-2">Select Character:</h3>
          <div className="grid grid-cols-3 gap-4">
            {playerCards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardSelect(card.id)}
                className={`p-4 rounded-lg ${
                  selectedCard === card.id
                    ? 'bg-blue-600'
                    : canStartTask(card.id)
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-800 opacity-50 cursor-not-allowed'
                }`}
                disabled={!canStartTask(card.id)}
              >
                <div className="font-bold">{card.name}</div>
                <div className="text-sm">
                  <div>Level: {card.level}</div>
                  <div>Energy: {card.energy}</div>
                  <div>Health: {card.health}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start Button or Game */}
      {selectedCard && !gameStarted && (
        <button
          onClick={() => setGameStarted(true)}
          className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold"
        >
          Start Task
        </button>
      )}

      {/* Game Component */}
      {gameStarted && !gameCompleted && (
        <GameSelector
          gameType={task.gameType}
          config={task.gameConfig}
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
};
