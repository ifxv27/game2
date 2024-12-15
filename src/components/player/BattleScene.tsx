import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaBolt, FaShieldAlt, FaMagic, FaRunning } from 'react-icons/fa';
import { useGameStore } from '../../store/gameStore';
import usePlayerStore from '../../store/1playerStore';
import { Card } from '../../types/card';

interface BattleSceneProps {
  playerCard: Card;
  opponentCard: Card;
  onBattleEnd: (result: { winner: string; rewards: any }) => void;
}

const BattleScene: React.FC<BattleSceneProps> = ({
  playerCard,
  opponentCard,
  onBattleEnd,
}) => {
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [playerHealth, setPlayerHealth] = useState(playerCard.stats.health);
  const [opponentHealth, setOpponentHealth] = useState(opponentCard.stats.health);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
  const [battleEnded, setBattleEnded] = useState(false);

  const calculateDamage = (attacker: Card, defender: Card) => {
    const attack = attacker.stats.power;
    const defense = defender.stats.defense;
    const luck = attacker.stats.luck || 1;
    const criticalHit = Math.random() < luck / 100;
    
    let damage = Math.max(1, attack - (defense * 0.5));
    if (criticalHit) damage *= 1.5;
    
    return {
      damage: Math.floor(damage),
      isCritical: criticalHit
    };
  };

  const handleAttack = () => {
    if (battleEnded) return;

    const attacker = currentTurn === 'player' ? playerCard : opponentCard;
    const defender = currentTurn === 'player' ? opponentCard : playerCard;
    
    const { damage, isCritical } = calculateDamage(attacker, defender);
    
    const logMessage = `${attacker.name} deals ${damage}${isCritical ? ' CRITICAL' : ''} damage to ${defender.name}!`;
    setBattleLog(prev => [...prev, logMessage]);

    if (currentTurn === 'player') {
      setOpponentHealth(prev => Math.max(0, prev - damage));
    } else {
      setPlayerHealth(prev => Math.max(0, prev - damage));
    }

    setCurrentTurn(current => current === 'player' ? 'opponent' : 'player');
  };

  useEffect(() => {
    if (currentTurn === 'opponent' && !battleEnded) {
      const timer = setTimeout(() => {
        handleAttack();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, battleEnded]);

  useEffect(() => {
    if (playerHealth <= 0 || opponentHealth <= 0) {
      setBattleEnded(true);
      const winner = playerHealth > 0 ? 'player' : 'opponent';
      onBattleEnd({
        winner,
        rewards: {
          experience: winner === 'player' ? 100 : 50,
          gold: winner === 'player' ? 50 : 25
        }
      });
    }
  }, [playerHealth, opponentHealth]);

  const renderCard = (card: Card, health: number, isPlayer: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: isPlayer ? 50 : -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem',
      }}
    >
      <img
        src={card.imageUrl}
        alt={card.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <div className="absolute top-2 right-2 bg-gray-900/80 rounded-lg px-3 py-1">
        <div className="flex items-center space-x-2 text-red-500">
          <FaHeart />
          <span>{health}/{card.stats.health}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2 text-purple-400">
          <FaMagic />
          <span>{card.stats.power}</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-400">
          <FaShieldAlt />
          <span>{card.stats.defense}</span>
        </div>
        <div className="flex items-center space-x-2 text-yellow-400">
          <FaBolt />
          <span>{card.stats.energy}</span>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <FaRunning />
          <span>{card.stats.speed}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-8">
          {renderCard(opponentCard, opponentHealth, false)}
          {renderCard(playerCard, playerHealth, true)}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleAttack}
            disabled={currentTurn !== 'player' || battleEnded}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium 
              hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Attack
          </button>
        </div>

        <div 
          className="h-48 overflow-y-auto p-4 rounded-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {battleLog.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white mb-2"
            >
              {log}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleScene;
