import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  class: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
    energy: number;
  };
  inventory: {
    cards: string[];
    items: string[];
  };
  achievements: string[];
  tasks: {
    active: string[];
    completed: string[];
  };
}

interface PlayerState {
  isAuthenticated: boolean;
  currentCharacter: Character | null;
  characters: Character[];
  currency: {
    gold: number;
    premium: number;
  };
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  createCharacter: (character: Omit<Character, 'id' | 'level' | 'experience' | 'inventory' | 'achievements' | 'tasks'>) => void;
  selectCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  addCurrency: (type: 'gold' | 'premium', amount: number) => void;
  addCard: (characterId: string, cardId: string) => void;
  removeCard: (characterId: string, cardId: string) => void;
  completeTask: (characterId: string, taskId: string) => void;
  gainExperience: (characterId: string, amount: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentCharacter: null,
      characters: [],
      currency: {
        gold: 0,
        premium: 0,
      },

      login: async (username: string, password: string) => {
        // In a real application, this would make an API call
        // For now, we'll simulate authentication
        if (username && password) {
          set({ isAuthenticated: true });
          toast.success('Successfully logged in');
        } else {
          toast.error('Invalid credentials');
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentCharacter: null,
        });
        toast.success('Successfully logged out');
      },

      createCharacter: (character) => {
        const newCharacter: Character = {
          id: Date.now().toString(),
          level: 1,
          experience: 0,
          inventory: {
            cards: [],
            items: [],
          },
          achievements: [],
          tasks: {
            active: [],
            completed: [],
          },
          ...character,
        };

        set((state) => ({
          characters: [...state.characters, newCharacter],
          currentCharacter: newCharacter,
        }));
        toast.success('Character created successfully');
      },

      selectCharacter: (id) => {
        const character = get().characters.find((c) => c.id === id);
        if (character) {
          set({ currentCharacter: character });
          toast.success(`Selected character: ${character.name}`);
        }
      },

      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === id ? { ...character, ...updates } : character
          ),
          currentCharacter:
            state.currentCharacter?.id === id
              ? { ...state.currentCharacter, ...updates }
              : state.currentCharacter,
        }));
        toast.success('Character updated successfully');
      },

      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((character) => character.id !== id),
          currentCharacter:
            state.currentCharacter?.id === id ? null : state.currentCharacter,
        }));
        toast.success('Character deleted successfully');
      },

      addCurrency: (type, amount) => {
        set((state) => ({
          currency: {
            ...state.currency,
            [type]: state.currency[type] + amount,
          },
        }));
        toast.success(`Added ${amount} ${type}`);
      },

      addCard: (characterId, cardId) => {
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === characterId
              ? {
                  ...character,
                  inventory: {
                    ...character.inventory,
                    cards: [...character.inventory.cards, cardId],
                  },
                }
              : character
          ),
        }));
        toast.success('Card added to inventory');
      },

      removeCard: (characterId, cardId) => {
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === characterId
              ? {
                  ...character,
                  inventory: {
                    ...character.inventory,
                    cards: character.inventory.cards.filter((id) => id !== cardId),
                  },
                }
              : character
          ),
        }));
        toast.success('Card removed from inventory');
      },

      completeTask: (characterId, taskId) => {
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === characterId
              ? {
                  ...character,
                  tasks: {
                    active: character.tasks.active.filter((id) => id !== taskId),
                    completed: [...character.tasks.completed, taskId],
                  },
                }
              : character
          ),
        }));
        toast.success('Task completed');
      },

      gainExperience: (characterId, amount) => {
        set((state) => ({
          characters: state.characters.map((character) => {
            if (character.id !== characterId) return character;

            const newExperience = character.experience + amount;
            const experiencePerLevel = 1000; // This could be configurable
            const newLevel = Math.floor(newExperience / experiencePerLevel) + 1;

            if (newLevel > character.level) {
              toast.success(`Level up! Now level ${newLevel}`);
            }

            return {
              ...character,
              level: newLevel,
              experience: newExperience,
            };
          }),
        }));
        toast.success(`Gained ${amount} experience`);
      },
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
