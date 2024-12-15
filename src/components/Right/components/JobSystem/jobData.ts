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
    events: [
      {
        id: 'vip_notice',
        type: 'positive',
        name: 'VIP Notice',
        description: 'A VIP client noticed your performance',
        probability: 0.2,
        effect: {
          rewards: {
            basePayment: 300,
            fameGain: 50
          }
        }
      },
      {
        id: 'tired_performance',
        type: 'negative',
        name: 'Exhaustion',
        description: 'The long hours are taking their toll',
        probability: 0.15,
        effect: {
          stats: {
            energy: -10,
            health: -5
          }
        }
      }
    ]
  },
  {
    id: 'photo_shoot',
    name: 'Photo Shoot',
    category: 'Modeling',
    description: 'Professional photo shoot for various media.',
    requirements: {
      minimumLevel: 2,
      requiredStats: {
        energy: 30,
        fame: 50
      }
    },
    duration: 120,
    cooldown: 240,
    rewards: {
      basePayment: 400,
      bonusChance: 0.4,
      experienceGain: 50,
      itemDropChance: 0.2,
      cardRollChance: 0.1
    },
    risks: {
      healthRisk: 5,
      energyCost: 35,
      reputationRisk: 10,
      failureChance: 0.1
    },
    events: [
      {
        id: 'magazine_cover',
        type: 'positive',
        name: 'Magazine Cover Shot',
        description: 'Your photos were selected for a magazine cover!',
        probability: 0.1,
        effect: {
          stats: {
            fame: 100
          },
          rewards: {
            basePayment: 1000
          }
        }
      }
    ]
  },
  // Add more jobs as needed
];
