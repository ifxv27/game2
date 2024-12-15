export enum CardRank {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Secret = 'Secret',
  Limited = 'Limited',
  VIP = 'VIP'
}

export interface Move {
  id: string;
  name: string;
  description: string;
  power: number;
  energyCost: number;
  type: 'physical' | 'magical' | 'status';
  category: 'attack' | 'defense' | 'support' | 'ultimate';
  effectChance?: number;
  statusEffect?: 'stun' | 'burn' | 'freeze' | 'poison' | 'heal' | 'shield' | 'buff' | 'debuff';
  targetType: 'single' | 'all' | 'self' | 'random';
  cooldown: number;
  animation?: string;
  classes: string[]; // Classes that can use this move
}

export interface CardClass {
  id: string;
  name: string;
  description: string;
  abilities: string[];
  moves: Move[];  // Available moves for this class
}

export type CardCategory = 
  | 'Task'      // Daily tasks
  | 'Battle'    // PvP cards
  | 'Store'     // Shop items
  | 'Trade'     // Tradeable cards
  | 'Starter'   // Beginning cards
  | 'Featured'  // Highlighted cards
  | 'Private'   // Special VIP content
  | 'Club'      // Club-exclusive cards
  | 'Event'     // Special event cards
  | 'After Hours' // Late night specials 

export interface Card {
  id: string;
  name: string;
  description: string;
  type?: string;
  class: string;
  skills: Move[];  // Changed from string[] to Move[]
  starRank: number;
  cardRank: CardRank;
  category: string;
  imageUrl: string;
  stats: {
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
    energy: number;
  };
  isStarter?: boolean;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
}
