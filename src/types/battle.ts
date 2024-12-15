export interface BattleCard {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  attack: number;
  defense: number;
  health: number;
  category: string;
  moves: string[];
  effects?: {
    name: string;
    description: string;
    duration: number;
  }[];
}

export interface Battle {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  player1: {
    id: string;
    cards: BattleCard[];
    currentCard?: string;
    health: number;
  };
  player2: {
    id: string;
    cards: BattleCard[];
    currentCard?: string;
    health: number;
  };
  turns: {
    playerId: string;
    cardId: string;
    moveId: string;
    damage: number;
    timestamp: number;
  }[];
  winner?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BattleMove {
  id: string;
  name: string;
  description: string;
  damage: number;
  accuracy: number;
  effects?: {
    name: string;
    description: string;
    duration: number;
  }[];
}
