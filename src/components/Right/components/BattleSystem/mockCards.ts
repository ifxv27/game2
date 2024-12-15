import { BattleCard, Move } from './types';

// Define some basic moves
const basicMoves: Move[] = [
  {
    id: '1',
    name: 'Quick Attack',
    description: 'A fast attack that strikes first',
    power: 20,
    energyCost: 10,
    animation: 'attack'
  },
  {
    id: '2',
    name: 'Power Strike',
    description: 'A powerful strike that deals heavy damage',
    power: 40,
    energyCost: 25,
    animation: 'special'
  },
  {
    id: '3',
    name: 'Ultimate Blast',
    description: 'An ultimate move that deals massive damage',
    power: 80,
    energyCost: 50,
    animation: 'ultimate'
  },
  {
    id: '4',
    name: 'Defense Stance',
    description: 'Raises defense for the next turn',
    power: 0,
    energyCost: 15,
    animation: 'defense'
  }
];

// Create a mock battle card
export const mockBattleCard: BattleCard = {
  id: 'mock-1',
  name: 'Battle Master',
  image: '/path/to/card/image.jpg',
  level: 1,
  health: 100,
  energy: 100,
  moves: basicMoves,
  stats: {
    attack: 50,
    defense: 30,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100
  }
};

// Create a mock opponent card
export const mockOpponentCard: BattleCard = {
  id: 'opponent-1',
  name: 'Dark Warrior',
  image: '/path/to/opponent/image.jpg',
  level: 1,
  health: 100,
  energy: 100,
  moves: basicMoves,
  stats: {
    attack: 45,
    defense: 35,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100
  }
};
