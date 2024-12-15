export interface Move {
  id: string;
  name: string;
  description: string;
  power: number;
  energyCost: number;
  animation: 'attack' | 'defense' | 'special' | 'ultimate';
}

export interface BattleCard {
  id: string;
  name: string;
  image: string;
  level: number;
  health: number;
  energy: number;
  moves: Move[];
  stats: {
    attack: number;
    defense: number;
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
  };
}

export interface BattleState {
  playerCard: BattleCard;
  opponentCard: BattleCard;
  turn: 'player' | 'opponent';
  round: number;
  gameOver: boolean;
  winner?: 'player' | 'opponent';
  lastMove?: {
    card: 'player' | 'opponent';
    move: Move;
    damage: number;
    critical: boolean;
  };
}
