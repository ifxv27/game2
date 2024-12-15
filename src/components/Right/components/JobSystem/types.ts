export interface JobStats {
  health: number;
  energy: number;
  money: number;
  fame: number;
  experience: number;
}

export interface JobRewards {
  basePayment: number;
  bonusChance: number;
  experienceGain: number;
  itemDropChance: number;
  cardRollChance: number;
}

export interface JobRisks {
  healthRisk: number;
  energyCost: number;
  reputationRisk: number;
  failureChance: number;
}

export interface Job {
  id: string;
  name: string;
  category: string;
  description: string;
  gameType?: string;
  requirements: {
    minimumLevel: number;
    requiredStats: Partial<JobStats>;
    requiredItems?: string[];
  };
  duration: number; // in minutes
  cooldown: number; // in minutes
  rewards: JobRewards;
  risks: JobRisks;
  events: JobEvent[];
}

export interface JobEvent {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  name: string;
  description: string;
  probability: number; // 0-1
  effect: {
    stats?: Partial<JobStats>;
    rewards?: Partial<JobRewards>;
    risks?: Partial<JobRisks>;
  };
}
