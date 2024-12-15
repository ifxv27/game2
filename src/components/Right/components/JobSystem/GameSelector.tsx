import React from 'react';
import { GameType, GameResult } from './minigames/types';
import { TimingGame } from './minigames/TimingGame';
import { MemoryGame } from './minigames/MemoryGame';
import { RhythmGame } from './minigames/RhythmGame';

interface GameSelectorProps {
  gameType: GameType;
  config: {
    difficulty: number;
    duration: number;
    targetScore: number;
    customSettings?: Record<string, any>;
  };
  onComplete: (result: GameResult) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  gameType,
  config,
  onComplete
}) => {
  // Return appropriate game based on type
  switch (gameType) {
    case 'timing':
      return (
        <TimingGame
          difficulty={config.difficulty}
          duration={config.duration}
          onComplete={onComplete}
        />
      );
    case 'memory':
      return (
        <MemoryGame
          difficulty={config.difficulty}
          duration={config.duration}
          onComplete={onComplete}
        />
      );
    case 'rhythm':
      return (
        <RhythmGame
          difficulty={config.difficulty}
          duration={config.duration}
          onComplete={onComplete}
        />
      );
    case 'none':
      // Auto-complete with basic success
      setTimeout(() => {
        onComplete({
          score: config.targetScore,
          success: true,
          bonusMultiplier: 1,
          timeSpent: 0,
          perfectBonus: false
        });
      }, 100);
      return <div>Processing task...</div>;
    default:
      return <div>Game type not implemented yet</div>;
  }
};
