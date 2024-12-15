import { Card } from '../types/card';

export const starterCards: Card[] = [
  {
    id: 'starter-warrior',
    name: 'Novice Warrior',
    description: 'A brave warrior beginning their journey. Well-balanced in attack and defense.',
    category: 'Starter',
    class: 'Warrior',
    rank: 'COMMON',
    imageUrl: 'https://i.imgur.com/placeholder1.jpg', // Replace with actual image URL
    starLevel: 1,
    isStarter: true,
    stats: {
      attack: 7,
      defense: 6,
      health: 8,
      energy: 5
    }
  },
  {
    id: 'starter-mage',
    name: 'Apprentice Mage',
    description: 'A student of the arcane arts. Specializes in powerful spells but has lower defense.',
    category: 'Starter',
    class: 'Mage',
    rank: 'COMMON',
    imageUrl: 'https://i.imgur.com/placeholder2.jpg', // Replace with actual image URL
    starLevel: 1,
    isStarter: true,
    stats: {
      attack: 8,
      defense: 4,
      health: 6,
      energy: 8
    }
  },
  {
    id: 'starter-rogue',
    name: 'Shadow Initiate',
    description: 'A quick and agile fighter. Excels in speed and precision strikes.',
    category: 'Starter',
    class: 'Rogue',
    rank: 'COMMON',
    imageUrl: 'https://i.imgur.com/placeholder3.jpg', // Replace with actual image URL
    starLevel: 1,
    isStarter: true,
    stats: {
      attack: 6,
      defense: 5,
      health: 7,
      energy: 8
    }
  }
];
