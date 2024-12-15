import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';

const BattleSystem: React.FC = () => {
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);
  const { updateStats } = useGameStore();
  const [opponent, setOpponent] = useState({ id: 'cpu', name: 'CPU', health: 100, attack: 10 });
  const [battleLog, setBattleLog] = useState<string[]>([]);

  useEffect(() => {
    if (currentPlayer && opponent) {
      setBattleLog([`Battle started between ${currentPlayer.name} and ${opponent.name}`]);
    }
  }, [currentPlayer, opponent]);

  const attack = () => {
    if (!currentPlayer) return;

    // Player attacks
    const playerDamage = Math.floor(Math.random() * (currentPlayer.power || 10));
    const newOpponentHealth = Math.max(0, opponent.health - playerDamage);
    setOpponent({ ...opponent, health: newOpponentHealth });
    setBattleLog((prev) => [
      ...prev,
      `${currentPlayer.name} deals ${playerDamage} damage to ${opponent.name}`,
    ]);

    // Check if opponent is defeated
    if (newOpponentHealth <= 0) {
      setBattleLog((prev) => [...prev, `${opponent.name} is defeated!`]);
      updateStats(currentPlayer.id, { 
        experience: (currentPlayer.experience || 0) + 50,
        power: (currentPlayer.power || 10) + 1
      });
      return;
    }

    // Opponent attacks
    const opponentDamage = Math.floor(Math.random() * opponent.attack);
    const newPlayerHealth = Math.max(0, (currentPlayer.health || 100) - opponentDamage);
    updateStats(currentPlayer.id, { health: newPlayerHealth });
    setBattleLog((prev) => [
      ...prev,
      `${opponent.name} deals ${opponentDamage} damage to ${currentPlayer.name}`,
    ]);

    // Check if player is defeated
    if (newPlayerHealth <= 0) {
      setBattleLog((prev) => [...prev, `${currentPlayer.name} is defeated!`]);
    }
  };

  if (!currentPlayer) {
    return <div className="text-center py-8">Please log in to access the battle system.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Battle System</h2>

      <div className="flex justify-between">
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-xl font-semibold">{currentPlayer.name}</h3>
          <p>Health: {currentPlayer.health || 100}</p>
          <p>Power: {currentPlayer.power || 10}</p>
          <p>Experience: {currentPlayer.experience || 0}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-xl font-semibold">{opponent.name}</h3>
          <p>Health: {opponent.health}</p>
          <p>Attack: {opponent.attack}</p>
        </div>
      </div>

      <button
        onClick={attack}
        className="w-full p-2 bg-red-600 rounded hover:bg-red-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!currentPlayer.health || opponent.health <= 0}
      >
        Attack
      </button>

      <div className="bg-gray-700 p-4 rounded h-40 overflow-y-auto">
        {battleLog.map((log, index) => (
          <p key={index} className="text-white">{log}</p>
        ))}
      </div>
    </div>
  );
};

export default BattleSystem;
