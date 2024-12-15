import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RARITY, rollRarity } from '../constants/cardRarity';
import { Card } from '../types/card';

interface Settings {
  enabled: boolean;
  minRarity: string;
  maxRarity: string;
  levelRange: {
    min: number;
    max: number;
  };
  allowedCategories: string[];
  rewardMultiplier: number;
  luckyRollChances: {
    [key: string]: number;
  };
}

interface DailyTaskState {
  currentDailyCard: Card | null;
  lastRollDate: string | null;
  luckyCard: Card | null;
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
  rollDailyCard: () => void;
  rollLuckyCard: (playerInventory: Card[]) => Card | null;
}

const defaultSettings: Settings = {
  enabled: true,
  minRarity: 'common',
  maxRarity: 'legendary',
  levelRange: {
    min: 1,
    max: 10
  },
  allowedCategories: ['all'],
  rewardMultiplier: 1.5,
  luckyRollChances: {
    common: 45,
    uncommon: 30,
    rare: 15,
    epic: 8,
    legendary: 2
  }
};

const useDailyTaskStore = create<DailyTaskState>()(
  persist(
    (set, get) => ({
      currentDailyCard: null,
      lastRollDate: null,
      luckyCard: null,
      settings: defaultSettings,

      setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      rollLuckyCard: (playerInventory) => {
        const { settings } = get();
        const roll = Math.random() * 100;
        let cumulative = 0;
        let selectedRarity = 'common';
        
        // Determine rarity based on chances
        for (const [rarity, chance] of Object.entries(settings.luckyRollChances)) {
          cumulative += chance;
          if (roll <= cumulative) {
            selectedRarity = rarity;
            break;
          }
        }
        
        // Create a lucky card with the selected rarity
        const luckyCard: Card = {
          id: Date.now().toString(),
          name: `Lucky ${selectedRarity.charAt(0).toUpperCase() + selectedRarity.slice(1)} Card`,
          description: `A lucky ${selectedRarity} card you won!`,
          imageUrl: '',
          classId: '1', // Default class ID
          skills: [],
          starRank: selectedRarity === 'legendary' ? 5 : 
                   selectedRarity === 'epic' ? 4 :
                   selectedRarity === 'rare' ? 3 :
                   selectedRarity === 'uncommon' ? 2 : 1,
          cardRank: selectedRarity.toUpperCase(),
          category: 'Lucky',
          power: Math.floor(Math.random() * 50) + 50,
          defense: Math.floor(Math.random() * 50) + 50,
          speed: Math.floor(Math.random() * 50) + 50
        };
        
        set({ luckyCard });
        return luckyCard;
      },

      rollDailyCard: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastRollDate } = get();

        if (lastRollDate === today) {
          return; // Already rolled today
        }

        // More appropriate themes for the content 😈
        const themes = [
          'Club', 'Lounge', 'Private', 'VIP', 'After Hours',
          'Backstage', 'Underground', 'Secret', 'Exclusive', 'Night'
        ];
        
        const adjectives = [
          'Wild', 'Hot', 'Naughty', 'Sultry', 'Forbidden',
          'Dark', 'Sinful', 'Tempting', 'Wicked', 'Dangerous'
        ];

        const theme = themes[Math.floor(Math.random() * themes.length)];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

        // Late night bonus (stronger cards at night 😏)
        const hour = new Date().getHours();
        const nightBonus = (hour >= 22 || hour <= 4) ? 15 : 0;
        const baseStats = 70 + nightBonus;

        const dailyCard: Card = {
          id: Date.now().toString(),
          name: `${adjective} ${theme}`,
          description: `A special card from the ${theme.toLowerCase()}. Available only today...`,
          imageUrl: '',
          classId: '1',
          skills: ['Seduction', 'Charm'],
          starRank: Math.min(5, Math.floor(Math.random() * 3) + 1 + (nightBonus > 0 ? 1 : 0)),
          // Special ranks at night 😈
          cardRank: hour >= 22 ? 'VIP' : 
                   nightBonus > 0 ? 'Limited' : 
                   'Common',
          // Categories change based on time
          category: hour >= 22 ? 'After Hours' :
                   hour >= 18 ? 'Club' :
                   'Private',
          power: baseStats + Math.floor(Math.random() * 30),
          defense: baseStats + Math.floor(Math.random() * 30),
          speed: baseStats + Math.floor(Math.random() * 30)
        };

        set({
          currentDailyCard: dailyCard,
          lastRollDate: today
        });
      }
    }),
    {
      name: 'daily-task-storage',
      version: 1
    }
  )
);

export default useDailyTaskStore;
