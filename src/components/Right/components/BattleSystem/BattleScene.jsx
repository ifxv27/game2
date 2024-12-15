import React, { useState, useEffect } from 'react';
import { GiCrossedSwords, GiHealthNormal } from 'react-icons/gi';
import { FaShieldAlt, FaBolt } from 'react-icons/fa';
import { useGameStore } from '../../../../store/gameStore';
import { useCards } from '../../../../hooks/useCards';

export const BattleScene = ({ playerCard, opponentCard, onBattleEnd }) => {
  const [battleState, setBattleState] = useState({
    playerHealth: 100,
    opponentHealth: 100,
    turn: 'player',
    logs: [],
    isFinished: false
  });

  const { updatePlayerStats } = useGameStore();
  const { getCardPower } = useCards();

  useEffect(() => {
    if (battleState.playerHealth <= 0 || battleState.opponentHealth <= 0) {
      const winner = battleState.playerHealth > 0 ? 'player' : 'opponent';
      handleBattleEnd(winner);
    }
  }, [battleState.playerHealth, battleState.opponentHealth]);

  const calculateDamage = (attacker, defender) => {
    const attackPower = getCardPower(attacker);
    const defensePower = getCardPower(defender);
    const baseDamage = Math.max(10, attackPower - defensePower);
    return Math.floor(baseDamage * (0.8 + Math.random() * 0.4)); // Random factor between 0.8 and 1.2
  };

  const attack = () => {
    const damage = calculateDamage(
      battleState.turn === 'player' ? playerCard : opponentCard,
      battleState.turn === 'player' ? opponentCard : playerCard
    );

    setBattleState(prev => {
      const newState = {
        ...prev,
        logs: [...prev.logs, `${battleState.turn === 'player' ? 'Player' : 'Opponent'} deals ${damage} damage!`],
        turn: prev.turn === 'player' ? 'opponent' : 'player'
      };

      if (battleState.turn === 'player') {
        newState.opponentHealth = Math.max(0, prev.opponentHealth - damage);
      } else {
        newState.playerHealth = Math.max(0, prev.playerHealth - damage);
      }

      return newState;
    });
  };

  const handleBattleEnd = (winner) => {
    if (!battleState.isFinished) {
      setBattleState(prev => ({ ...prev, isFinished: true }));
      
      if (winner === 'player') {
        // Update player stats
        updatePlayerStats({
          exp: 100,
          coins: 50,
          wins: 1
        });
      }

      onBattleEnd?.({
        winner,
        playerCard,
        opponentCard,
        rewards: winner === 'player' ? { exp: 100, coins: 50 } : null
      });
    }
  };

  return (
    <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30">
      <div className="flex justify-between mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">{playerCard.name}</div>
          <div className="flex items-center justify-center mt-2">
            <GiHealthNormal className="text-red-500 mr-2" />
            <div className="w-32 h-4 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${battleState.playerHealth}%` }}
              />
            </div>
            <span className="ml-2 text-red-400">{battleState.playerHealth}%</span>
          </div>
        </div>

        <GiCrossedSwords className="text-4xl text-purple-500 mx-4" />

        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">{opponentCard.name}</div>
          <div className="flex items-center justify-center mt-2">
            <GiHealthNormal className="text-red-500 mr-2" />
            <div className="w-32 h-4 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${battleState.opponentHealth}%` }}
              />
            </div>
            <span className="ml-2 text-red-400">{battleState.opponentHealth}%</span>
          </div>
        </div>
      </div>

      <div className="max-h-32 overflow-y-auto mb-4 p-2 bg-black/40 rounded">
        {battleState.logs.map((log, index) => (
          <div key={index} className="text-gray-300 mb-1">{log}</div>
        ))}
      </div>

      {!battleState.isFinished && battleState.turn === 'player' && (
        <div className="flex justify-center gap-4">
          <button
            onClick={attack}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-600/80 rounded-lg flex items-center"
          >
            <GiCrossedSwords className="mr-2" /> Attack
          </button>
          <button
            onClick={() => handleBattleEnd('opponent')}
            className="px-4 py-2 bg-gray-500/80 hover:bg-gray-600/80 rounded-lg"
          >
            Surrender
          </button>
        </div>
      )}

      {battleState.isFinished && (
        <div className="text-center">
          <div className="text-xl font-bold mb-2">
            {battleState.playerHealth > 0 ? (
              <span className="text-green-400">Victory!</span>
            ) : (
              <span className="text-red-400">Defeat!</span>
            )}
          </div>
          {battleState.playerHealth > 0 && (
            <div className="text-purple-400">
              Rewards: 100 EXP, 50 Coins
            </div>
          )}
        </div>
      )}
    </div>
  );
};
