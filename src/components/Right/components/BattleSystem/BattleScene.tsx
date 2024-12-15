import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { BattleEffects } from './BattleEffects';
import { BattleCard, Move, BattleState, Rewards } from './types';
import { ErrorBoundary } from './ErrorBoundary';
import { BattleArena } from './BattleArena';
import { useGameStore } from '../../../../store/gameStore';

interface BattleSceneProps {
  playerCard: BattleCard;
  opponentCard: BattleCard;
  onBattleEnd: (winner: BattleCard) => void;
}

export function BattleScene({ playerCard, opponentCard, onBattleEnd }: BattleSceneProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    playerCard,
    opponentCard,
    turn: 'player',
    round: 1,
    gameOver: false
  });

  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [animation, setAnimation] = useState({
    type: '',
    card: '',
    active: false
  });

  // Battle UI animations
  const uiVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle move selection
  const handleMoveSelect = (move: Move) => {
    if (battleState.turn !== 'player' || battleState.gameOver) return;
    if (move.energyCost > battleState.playerCard.stats.energy) return;

    setSelectedMove(move);
    executeMove(move, 'player', battleState.opponentCard);
  };

  // Execute move
  const executeMove = async (move: Move, attacker: 'player' | 'opponent', target: BattleCard) => {
    // Start animation
    setAnimation({
      type: move.animation,
      card: attacker,
      active: true
    });

    // Calculate damage with critical hit chance
    const attackerCard = attacker === 'player' ? battleState.playerCard : battleState.opponentCard;
    const critical = Math.random() < 0.1; // 10% critical hit chance
    const baseDamage = (move.power * attackerCard.stats.attack) / target.stats.defense;
    const damage = critical ? baseDamage * 1.5 : baseDamage;

    // Update battle state
    setBattleState(prev => {
      const newState = { ...prev };
      const targetCard = attacker === 'player' ? 'opponentCard' : 'playerCard';
      const newHealth = Math.max(0, newState[targetCard].stats.health - damage);
      newState[targetCard].stats.health = newHealth;

      // Update energy
      const attackerKey = attacker === 'player' ? 'playerCard' : 'opponentCard';
      newState[attackerKey].stats.energy -= move.energyCost;

      // Check for game over
      if (newHealth <= 0) {
        newState.gameOver = true;
        newState.winner = attacker;
        if (attacker === 'player') {
          // Add kill and calculate rewards
          useGameStore.getState().addKill();
          const rewards: Rewards = useGameStore.getState().calculateRewards('win', target.level);
          useGameStore.getState().addMoney(rewards.money);
          useGameStore.getState().addExperience(rewards.experience);
          useGameStore.getState().addWin();
          onBattleEnd(playerCard); // Call onBattleEnd with winner card
        } else {
          const rewards: Rewards = useGameStore.getState().calculateRewards('loss', target.level);
          useGameStore.getState().addExperience(rewards.experience);
          useGameStore.getState().addLoss();
          onBattleEnd(opponentCard); // Call onBattleEnd with winner card
        }
      } else {
        // Switch turns
        newState.turn = attacker === 'player' ? 'opponent' : 'player';
      }

      // Record last move
      newState.lastMove = {
        card: attacker,
        move,
        damage,
        critical
      };

      return newState;
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnimation(prev => ({ ...prev, active: false }));

    // If it's opponent's turn after player's move, execute opponent move
    if (!battleState.gameOver && attacker === 'player') {
      setTimeout(() => {
        const opponentMove = selectOpponentMove();
        if (opponentMove) {
          executeMove(opponentMove, 'opponent', battleState.playerCard);
        }
      }, 1000);
    }
  };

  // AI opponent turn
  useEffect(() => {
    if (battleState.turn === 'opponent' && !battleState.gameOver) {
      const availableMoves = battleState.opponentCard.moves.filter(
        move => move.energyCost <= battleState.opponentCard.stats.energy
      );

      if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        setTimeout(() => {
          executeMove(randomMove, 'opponent', battleState.playerCard);
        }, 1000);
      }
    }
  }, [battleState.turn]);

  // Calculate damage
  const calculateDamage = (move: Move, attacker: BattleCard, defender: BattleCard) => {
    const base = move.power * (attacker.stats.attack / defender.stats.defense);
    const random = 0.85 + Math.random() * 0.3;
    return Math.floor(base * random);
  };

  return (
    <ErrorBoundary>
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Battle Arena - Gradient Glass Hero Layout */}
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-950">
          {/* Background Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(to_right,rgba(88,28,135,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(88,28,135,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          {/* Glass Morphic Container */}
          <div className="relative w-full h-full max-w-7xl mx-auto flex items-stretch bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10">
            {/* Left Column - Opponent Card */}
            <div className="w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-violet-950/30 via-indigo-950/30 to-purple-950/30 backdrop-blur-md">
              <motion.div 
                className="w-full max-w-md transform -rotate-3 hover:rotate-0 transition-transform"
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  card={battleState.opponentCard}
                  position="opponent"
                  isActive={battleState.turn === 'opponent'}
                  isAttacking={animation.type === 'attack' && animation.card === 'opponent'}
                />
              </motion.div>
            </div>

            {/* Vertical Divider with VERSUS */}
            <div className="relative w-16 flex flex-col items-center justify-center bg-gradient-to-b from-violet-950/50 via-indigo-950/50 to-purple-950/50 backdrop-blur-md">
              {/* Stylish Divider */}
              <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
              
              {/* Vertical VERSUS */}
              <div className="transform -rotate-90 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-indigo-600 tracking-wider">
                VS
              </div>
            </div>

            {/* Right Column - Player Card */}
            <div className="w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-violet-950/30 via-indigo-950/30 to-purple-950/30 backdrop-blur-md">
              <motion.div 
                className="w-full max-w-md transform rotate-3 hover:rotate-0 transition-transform"
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  card={battleState.playerCard}
                  position="player"
                  isActive={battleState.turn === 'player'}
                  isAttacking={animation.type === 'attack' && animation.card === 'player'}
                />
              </motion.div>
            </div>
          </div>

          {/* Battle Effects Layer */}
          {animation.active && (
            <BattleEffects
              type={animation.type as any}
              position={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
              }}
              onComplete={() => setAnimation({ type: '', card: '', active: false })}
            />
          )}
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}
