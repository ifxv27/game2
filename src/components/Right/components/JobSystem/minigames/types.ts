export type GameType = 
  | 'timing'
  | 'rhythm'
  | 'memory'
  | 'quicktime'
  | 'choice'
  | 'puzzle'
  | 'reaction'
  | 'cards'
  | 'none';  // For tasks that don't need mini-games

export interface GameConfig {
  type: GameType;
  difficulty: number;
  duration: number;
  targetScore: number;
  customSettings?: Record<string, any>;
}

export interface GameResult {
  score: number;
  success: boolean;
  bonusMultiplier: number;
  timeSpent: number;
  perfectBonus: boolean;
}

export interface CardUpdate {
  cardId: string;
  updates: {
    money?: number;
    health?: number;
    energy?: number;
    experience?: number;
    skills?: Record<string, number>;
    inventory?: Array<{
      itemId: string;
      quantity: number;
    }>;
    stats?: Record<string, number>;
    [key: string]: any; // For custom card properties
  };
}
