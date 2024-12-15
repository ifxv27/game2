import { Card } from './card';

export interface PlayerStats {
  level: number;
  experience: number;
  gamesPlayed: number;
  wins: number;
  coins: number;
  energy: number;
  health: number;
}

export interface PlayerInventory {
  cards: Card[];
  maxCardCapacity?: number;
  tradableCards?: Card[];
}

export interface PlayerCharacter {
  id: string;
  name: string;
  class: string;
  imageUrl: string;
  starRank: number;
  stats: {
    power: number;
    energy: number;
    health: number;
    defense: number;
  };
}

export interface Player {
  id: string;
  username: string;
  email: string;
  role: 'player' | 'admin';
  
  // Authentication & Security
  password?: string;
  lastLogin?: Date;
  
  // Game Progression
  character?: PlayerCharacter;
  activeCard?: Card;
  hasStarterCard: boolean;
  
  // Inventory Management
  inventory: Card[];
  
  // Player Progression
  stats: PlayerStats;
  
  // Trading & Social
  friends?: string[];
  tradingStatus?: 'available' | 'busy' | 'offline';
  
  // Additional Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlayerCreationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedCard?: Card;
}
