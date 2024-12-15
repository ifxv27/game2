export interface JobStats {
  energy: number;
  health: number;
  fame?: number;
}

export interface Job {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: {
    minimumLevel?: number;
    requiredStats: {
      energy?: number;
      health?: number;
    }
  };
  duration: number;
  cooldown?: number;
  rewards: {
    basePayment: number;
    bonusChance: number;
    experienceGain: number;
    itemDropChance?: number;
    cardRollChance?: number;
  };
  risks: {
    healthRisk: number;
    energyCost: number;
    reputationRisk?: number;
    failureChance: number;
  };
  gameType?: 'memory' | 'rhythm' | 'timing';
  events?: Array<{
    type: string;
    chance: number;
    effect: {
      type: string;
      value: number;
    };
  }>;
}
