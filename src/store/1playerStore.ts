import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Card } from '../types/card';
import { toast } from 'react-toastify';

interface Stats {
  power: number;
  defense: number;
  health: number;
  energy: number;
  luck: number;
  speed: number;
}

interface Task {
  id: string;
  name: string;
  description: string;
  reward: {
    experience: number;
    gold: number;
    items?: string[];
  };
  requirements: {
    level?: number;
    stats?: Partial<Stats>;
  };
  timeRequired: number;
  category: string;
  status: 'available' | 'in_progress' | 'completed' | 'failed';
}

interface Battle {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  rewards: {
    experience: number;
    gold: number;
    items?: string[];
  };
  timestamp: string;
}

interface InventoryItem {
  id: string;
  type: 'card' | 'consumable' | 'equipment';
  name: string;
  description: string;
  quantity: number;
  stats?: Partial<Stats>;
}

interface Character {
  id: string;
  name: string;
  cardId: string;
  imageUrl: string;
  level: number;
  experience: number;
  stats: Stats;
  inventory: {
    coins: number;
    items: InventoryItem[];
  };
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  achievements: string[];
  tasks: Task[];
  battleHistory: Battle[];
  lastTaskCompletionTime?: string;
  energyPoints: number;
  maxEnergyPoints: number;
  energyRechargeRate: number;
  lastEnergyRechargeTime: string;
}

interface PlayerState {
  username: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  player: {
    id: string;
    username: string;
    inventory: InventoryItem[];
    currency: number;
    experience: number;
    level: number;
    classes: string[];
    moves: string[];
    tasks: Task[];
    achievements: string[];
    settings: {
      theme: string;
      sound: boolean;
      music: boolean;
      notifications: boolean;
    };
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createCharacter: (name: string, cardId: string, imageUrl: string) => void;
  selectCharacter: (characterId: string) => void;
  deleteCharacter: (characterId: string) => void;
  gainExperience: (amount: number) => void;
  levelUp: () => void;
  updateStats: (newStats: Partial<Stats>) => void;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => boolean;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string, quantity?: number) => boolean;
  useItem: (itemId: string) => void;
  equipItem: (itemId: string, slot: keyof Character['equipment']) => void;
  unequipItem: (slot: keyof Character['equipment']) => void;
  startTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  startBattle: (opponentId: string) => Promise<Battle>;
  useEnergy: (amount: number) => boolean;
  rechargeEnergy: () => void;
  unlockAchievement: (achievementId: string) => void;
}

const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      username: null,
      isAuthenticated: false,
      isAdmin: false,
      player: null,

      login: async (username: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For demo purposes, accept any non-empty username/password
        if (username && password) {
          set({
            username,
            isAuthenticated: true,
            isAdmin: username.toLowerCase() === 'admin',
            player: {
              id: '1',
              username,
              inventory: [],
              currency: 1000,
              experience: 0,
              level: 1,
              classes: [],
              moves: [],
              tasks: [],
              achievements: [],
              settings: {
                theme: 'dark',
                sound: true,
                music: true,
                notifications: true,
              },
            },
          });
          toast.success('Login successful!');
          return true;
        }
        toast.error('Invalid credentials');
        return false;
      },

      logout: () => {
        set({
          username: null,
          isAuthenticated: false,
          isAdmin: false,
          player: null,
        });
        toast.info('Logged out successfully');
      },

      createCharacter: (name: string, cardId: string, imageUrl: string) => {
        const { cards } = useGameStore.getState();
        const card = cards.find(c => c.id === cardId);
        
        if (!card) {
          toast.error('Selected card not found');
          return;
        }

        set((state) => {
          if (state.player) {
            toast.error('Character already exists');
            return state;
          }

          const newPlayer = {
            id: Math.random().toString(36).substr(2, 9),
            username: name,
            cardId: cardId,
            imageUrl: imageUrl,
            level: 1,
            experience: 0,
            stats: { ...card.stats },
            inventory: {
              coins: 100,
              items: []
            },
            equipment: {},
            achievements: [],
            tasks: [],
            battleHistory: [],
            energyPoints: 100,
            maxEnergyPoints: 100,
            energyRechargeRate: 1,
            lastEnergyRechargeTime: new Date().toISOString()
          };

          toast.success('Character created successfully!');
          
          return {
            ...state,
            player: newPlayer
          };
        });
      },

      selectCharacter: (characterId: string) => {
        set({ activeCharacter: characterId });
      },

      deleteCharacter: (characterId: string) => {
        set((state) => ({
          characters: state.characters.filter((char) => char.id !== characterId),
          activeCharacter:
            state.activeCharacter === characterId
              ? null
              : state.activeCharacter,
        }));
      },

      gainExperience: (amount: number) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const updatedCharacter = {
            ...character,
            experience: character.experience + amount,
          };

          // Check if should level up
          if (updatedCharacter.experience >= updatedCharacter.level * 1000) {
            get().levelUp();
          }

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      levelUp: () => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const updatedCharacter = {
            ...character,
            level: character.level + 1,
            experience: 0,
            stats: {
              ...character.stats,
              power: character.stats.power + 2,
              defense: character.stats.defense + 2,
              health: character.stats.health + 10,
              energy: character.stats.energy + 5,
              luck: character.stats.luck + 1,
              speed: character.stats.speed + 1,
            },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      updateStats: (newStats: Partial<Stats>) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const updatedCharacter = {
            ...character,
            stats: { ...character.stats, ...newStats },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      addCoins: (amount: number) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const updatedCharacter = {
            ...character,
            inventory: {
              ...character.inventory,
              coins: character.inventory.coins + amount,
            },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      removeCoins: (amount: number) => {
        const state = get();
        const character = state.characters.find(
          (char) => char.id === state.activeCharacter
        );
        if (!character || character.inventory.coins < amount) return false;

        set((state) => {
          const updatedCharacter = {
            ...character,
            inventory: {
              ...character.inventory,
              coins: character.inventory.coins - amount,
            },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });

        return true;
      },

      addItem: (item: InventoryItem) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const existingItem = character.inventory.items.find(
            (i) => i.id === item.id
          );

          let updatedItems;
          if (existingItem) {
            updatedItems = character.inventory.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            updatedItems = [...character.inventory.items, item];
          }

          const updatedCharacter = {
            ...character,
            inventory: {
              ...character.inventory,
              items: updatedItems,
            },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      removeItem: (itemId: string, quantity = 1) => {
        const state = get();
        const character = state.characters.find(
          (char) => char.id === state.activeCharacter
        );
        if (!character) return false;

        const item = character.inventory.items.find((i) => i.id === itemId);
        if (!item || item.quantity < quantity) return false;

        set((state) => {
          const updatedItems = character.inventory.items
            .map((i) =>
              i.id === itemId
                ? { ...i, quantity: i.quantity - quantity }
                : i
            )
            .filter((i) => i.quantity > 0);

          const updatedCharacter = {
            ...character,
            inventory: {
              ...character.inventory,
              items: updatedItems,
            },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });

        return true;
      },

      useItem: (itemId: string) => {
        // Implementation depends on item type and effects
        // For now, just remove the item
        get().removeItem(itemId, 1);
      },

      equipItem: (itemId: string, slot: keyof Character['equipment']) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const updatedCharacter = {
            ...character,
            equipment: {
              ...character.equipment,
              [slot]: itemId,
            },
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      unequipItem: (slot: keyof Character['equipment']) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const { [slot]: removed, ...remainingEquipment } = character.equipment;
          const updatedCharacter = {
            ...character,
            equipment: remainingEquipment,
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      startTask: async (taskId: string) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const task = character.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updatedTask = { ...task, status: 'in_progress' as const };
          const updatedCharacter = {
            ...character,
            tasks: character.tasks.map((t) =>
              t.id === taskId ? updatedTask : t
            ),
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      completeTask: async (taskId: string) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const task = character.tasks.find((t) => t.id === taskId);
          if (!task || task.status !== 'in_progress') return state;

          // Award rewards
          get().gainExperience(task.reward.experience);
          get().addCoins(task.reward.gold);
          task.reward.items?.forEach((itemId) => {
            // Add reward items to inventory
            // Implementation depends on item system
          });

          const updatedTask = { ...task, status: 'completed' as const };
          const updatedCharacter = {
            ...character,
            tasks: character.tasks.map((t) =>
              t.id === taskId ? updatedTask : t
            ),
            lastTaskCompletionTime: new Date().toISOString(),
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      startBattle: async (opponentId: string) => {
        const state = get();
        const character = state.characters.find(
          (char) => char.id === state.activeCharacter
        );
        if (!character) throw new Error('No active character');

        // Mock battle logic - replace with actual battle system
        const result = Math.random() > 0.5 ? 'win' : 'loss';
        const battle: Battle = {
          id: crypto.randomUUID(),
          opponent: opponentId,
          result,
          rewards: {
            experience: result === 'win' ? 100 : 25,
            gold: result === 'win' ? 50 : 10,
          },
          timestamp: new Date().toISOString(),
        };

        if (result === 'win') {
          get().gainExperience(battle.rewards.experience);
          get().addCoins(battle.rewards.gold);
        }

        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const updatedCharacter = {
            ...character,
            battleHistory: [...character.battleHistory, battle],
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });

        return battle;
      },

      useEnergy: (amount: number) => {
        const state = get();
        const character = state.characters.find(
          (char) => char.id === state.activeCharacter
        );
        if (!character || character.energyPoints < amount) return false;

        set((state) => {
          const updatedCharacter = {
            ...character,
            energyPoints: character.energyPoints - amount,
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });

        return true;
      },

      rechargeEnergy: () => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          const now = new Date();
          const lastRecharge = new Date(character.lastEnergyRechargeTime);
          const hoursSinceRecharge =
            (now.getTime() - lastRecharge.getTime()) / (1000 * 60 * 60);
          const rechargeAmount = Math.floor(
            hoursSinceRecharge * character.energyRechargeRate
          );

          const updatedCharacter = {
            ...character,
            energyPoints: Math.min(
              character.maxEnergyPoints,
              character.energyPoints + rechargeAmount
            ),
            lastEnergyRechargeTime: now.toISOString(),
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          const character = state.characters.find(
            (char) => char.id === state.activeCharacter
          );
          if (!character) return state;

          if (character.achievements.includes(achievementId)) return state;

          const updatedCharacter = {
            ...character,
            achievements: [...character.achievements, achievementId],
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.activeCharacter ? updatedCharacter : char
            ),
          };
        });
      },
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePlayerStore;
