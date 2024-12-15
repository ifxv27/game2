import { Job } from './types';

export const jobs: Job[] = [
  {
    id: 'club_performance',
    name: 'Club Performance',
    category: 'Entertainment',
    description: 'Perform at an exclusive club. Higher fame increases tips.',
    requirements: {
      minimumLevel: 1,
      requiredStats: {
        energy: 20,
        health: 30
      }
    },
    duration: 30,
    cooldown: 60,
    rewards: {
      basePayment: 150,
      bonusChance: 0.3,
      experienceGain: 25,
      itemDropChance: 0.1,
      cardRollChance: 0.05
    },
    risks: {
      healthRisk: 10,
      energyCost: 25,
      reputationRisk: 5,
      failureChance: 0.15
    },
    gameType: 'rhythm'
  },
  {
    id: 'street_performance',
    name: 'Street Performance',
    category: 'Entertainment',
    description: 'Perform in the streets. Quick money but risky.',
    requirements: {
      minimumLevel: 1,
      requiredStats: {
        energy: 15,
        health: 20
      }
    },
    duration: 20,
    cooldown: 30,
    rewards: {
      basePayment: 80,
      bonusChance: 0.4,
      experienceGain: 15,
      itemDropChance: 0.05,
      cardRollChance: 0.02
    },
    risks: {
      healthRisk: 5,
      energyCost: 15,
      reputationRisk: 10,
      failureChance: 0.2
    },
    gameType: 'timing'
  },
  {
    id: 'card_tournament',
    name: 'Card Tournament',
    category: 'Gaming',
    description: 'Participate in a card memory tournament.',
    requirements: {
      minimumLevel: 2,
      requiredStats: {
        energy: 25,
        health: 20
      }
    },
    duration: 45,
    cooldown: 90,
    rewards: {
      basePayment: 200,
      bonusChance: 0.25,
      experienceGain: 35,
      itemDropChance: 0.15,
      cardRollChance: 0.1
    },
    risks: {
      healthRisk: 5,
      energyCost: 30,
      reputationRisk: 15,
      failureChance: 0.25
    },
    gameType: 'memory'
  }
];
