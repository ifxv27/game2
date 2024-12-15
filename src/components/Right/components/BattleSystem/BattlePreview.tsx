import React, { useState } from 'react';
import { BattleScene } from './BattleScene';
import { BattleCard } from './types';

// Sample player card
const playerCard: BattleCard = {
  id: "player1",
  name: "Shadow Dancer",
  image: "/characters/player.png",
  model: "/models/character.glb", // We'll use default if not found
  stats: {
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    attack: 15,
    defense: 10,
    speed: 12
  },
  moves: [
    {
      id: "move1",
      name: "Shadow Strike",
      type: "attack",
      power: 25,
      energyCost: 20,
      description: "A quick strike from the shadows",
      animation: "attack",
      effects: [
        {
          type: "stun",
          chance: 0.2,
          duration: 1,
          value: 1
        }
      ]
    },
    {
      id: "move2",
      name: "Dark Shield",
      type: "defense",
      power: 0,
      energyCost: 15,
      description: "Create a shield of darkness",
      animation: "defense",
      effects: [
        {
          type: "buff",
          chance: 1,
          duration: 2,
          value: 5
        }
      ]
    },
    {
      id: "move3",
      name: "Energy Drain",
      type: "special",
      power: 15,
      energyCost: 30,
      description: "Drain opponent's energy",
      animation: "special",
      effects: [
        {
          type: "debuff",
          chance: 0.8,
          duration: 2,
          value: -10
        }
      ]
    },
    {
      id: "move4",
      name: "Ultimate Shadow",
      type: "special",
      power: 50,
      energyCost: 50,
      description: "Unleash ultimate shadow power",
      animation: "ultimate",
      effects: [
        {
          type: "burn",
          chance: 0.5,
          duration: 3,
          value: 5
        }
      ]
    }
  ],
  level: 5,
  experience: 0
};

// Sample opponent card
const opponentCard: BattleCard = {
  id: "opponent1",
  name: "Light Weaver",
  image: "/characters/opponent.png",
  model: "/models/character.glb", // We'll use default if not found
  stats: {
    health: 90,
    maxHealth: 90,
    energy: 90,
    maxEnergy: 90,
    attack: 12,
    defense: 12,
    speed: 10
  },
  moves: [
    {
      id: "move1",
      name: "Light Beam",
      type: "attack",
      power: 20,
      energyCost: 15,
      description: "A beam of pure light",
      animation: "attack"
    },
    {
      id: "move2",
      name: "Holy Shield",
      type: "defense",
      power: 0,
      energyCost: 20,
      description: "Create a shield of light",
      animation: "defense",
      effects: [
        {
          type: "heal",
          chance: 1,
          duration: 1,
          value: 10
        }
      ]
    },
    {
      id: "move3",
      name: "Purifying Light",
      type: "special",
      power: 30,
      energyCost: 40,
      description: "Purify with holy light",
      animation: "special"
    }
  ],
  level: 4,
  experience: 0
};

interface BattlePreviewProps {
  onClose: () => void;
  playerCard: any; // TODO: Update with proper card type
}

const BattlePreview: React.FC<BattlePreviewProps> = ({ onClose, playerCard }) => {
  const [showBattle, setShowBattle] = useState(false);
  const [battleResult, setBattleResult] = useState<string>("");

  const handleBattleEnd = (winner: BattleCard) => {
    setBattleResult(`${winner.name} wins the battle!`);
    setTimeout(() => {
      setShowBattle(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center p-6">
      {!showBattle ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">Battle Preview</h1>
          <button
            onClick={() => setShowBattle(true)}
            className="px-8 py-4 bg-purple-600 text-white rounded-lg text-xl hover:bg-purple-500 transition-colors"
          >
            Start Battle
          </button>
          {battleResult && (
            <div className="mt-4 text-2xl text-white">{battleResult}</div>
          )}
        </div>
      ) : (
        <BattleScene
          playerCard={playerCard}
          opponentCard={opponentCard}
          onBattleEnd={handleBattleEnd}
        />
      )}
    </div>
  );
};

export default BattlePreview;
