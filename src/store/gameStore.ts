import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface CardRank {
  value: number;
  stars: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  grid: string;
}

interface Class {
  id: string;
  name: string;
  description: string;
  abilities: string[];
}

interface Card {
  id: string;
  name: string;
  description: string;
  category: string;
  class: string;
  rank: string;
  imageUrl: string;
  starLevel: number;
  isStarter?: boolean;
  stats?: {
    attack: number;
    defense: number;
    health: number;
    energy: number;
  };
}

interface Task {
  id: string;
  name: string;
  description: string;
  requirements: {
    requiredStats: {
      energy: number;
      health: number;
    };
    minimumLevel: number;
  };
  rewards: {
    health: number;
    energy: number;
    power: number;
    defense: number;
    experienceGain: number;
    basePayment: number;
  };
  risks: {
    healthRisk: number;
    energyCost: number;
    failureChance: number;
  };
  cooldown: number;
  lastCompleted: number;
  completed?: boolean;
  completedAt?: Date;
  experience?: number;
  reward?: number;
  progress?: number;
}

interface Move {
  id: string;
  name: string;
  description: string;
  power: number;
  energyCost: number;
  type: 'physical' | 'magical' | 'status';
  category: 'attack' | 'defense' | 'support' | 'ultimate';
  targetType: 'single' | 'multi' | 'self' | 'all';
  cooldown: number;
  classes: string[];
  createdAt?: string;
}

interface PlayerProfile {
  id: string;
  role: string;
  hasStarterCard: boolean;
  character?: {
    id: string;
    name: string;
    class: string;
    className: string;
    imageUrl: string;
    starRank: number;
    stats: {
      power: number;
      energy: number;
      health: number;
      defense: number;
    };
  };
  inventory: Card[];
  stats: {
    level: number;
    gamesPlayed: number;
    wins: number;
    coins: number;
    experience: number;
  };
}

interface Character {
  id: string;
  name: string;
  class: string;
  className: string;
  imageUrl: string;
  starRank: number;
  stats: {
    power: number;
    energy: number;
    health: number;
    defense: number;
  };
}

interface GameState {
  cards: Card[];
  categories: Category[];
  classes: Class[];
  moves: Move[];
  selectedCard: Card | null;
  selectedCharacter: Character | null;
  characterImages: string[];
  selectedImageIndex: number;
  tasks: Task[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  playerProfile: PlayerProfile | null;
  initializeStore: () => void;
  addMove: (move: Move) => void;
  updateMove: (id: string, move: Move) => void;
  deleteMove: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addClass: (newClass: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  addCard: (card: Card) => boolean;
  updateCard: (updatedCard: Card) => void;
  deleteCard: (id: string) => void;
  getCardsByCategory: (category: string) => Card[];
  getCardsByGrid: (grid: string) => Card[];
  getCardById: (id: string) => Card | undefined;
  getStarterCards: () => Card[];
  setCardAsStarter: (cardId: string, isStarter?: boolean) => void;
  setPlayerProfile: (profile: PlayerProfile) => void;
  selectCard: (cardId: string) => void;
  updateCardStats: (cardId: string, stats: any) => void;
  getPlayerProfile: () => PlayerProfile | null;
  setSelectedCharacter: (character: Character) => void;
  getSelectedCharacter: () => Character | null;
  updateCharacterImages: (images: string[]) => void;
  selectCharacterImage: (index: number) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  login: (isAdmin?: boolean) => void;
  logout: () => void;
  resetStore: () => void;
  getGlobalMoves: (filters?: { class?: string, category?: Move['category'], type?: Move['type'] }) => Move[];
  updateGlobalMove: (moveId: string, updatedMove: Partial<Move>) => void;
  removeGlobalMove: (moveId: string) => void;
  activePlayers: number;
  totalMatches: number;
  totalCards: number;
  onlinePlayers: number;
  leaderboard: {
    id: string;
    name: string;
    rank: number;
    points: number;
    wins: number;
    losses: number;
  }[];
  matchHistory: {
    id: string;
    player1: string;
    player2: string;
    winner: string;
    timestamp: number;
    type: 'quick' | 'ranked' | 'practice';
    points: number;
  }[];
  currentMatches: {
    id: string;
    player1: string;
    player2: string;
    type: 'quick' | 'ranked' | 'practice';
    startTime: number;
    status: 'waiting' | 'in_progress' | 'finished';
  }[];
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  startMatch: (player1: string, player2: string, type: 'quick' | 'ranked' | 'practice') => string;
  endMatch: (matchId: string, winner: string) => void;
  updateLeaderboard: (playerId: string, points: number) => void;
  getPlayerRank: (playerId: string) => number;
  getMatchHistory: (playerId: string) => typeof GameState.prototype.matchHistory;
  getCurrentMatches: () => typeof GameState.prototype.currentMatches;
}

const CARD_RANKS: Record<string, CardRank> = {
  COMMON: { value: 1, stars: '⭐' },
  RARE: { value: 2, stars: '⭐⭐' },
  EPIC: { value: 3, stars: '⭐⭐⭐' },
  LEGEND: { value: 4, stars: '⭐⭐⭐⭐' }
};

const DEFAULT_BATTLE_CARDS = [
  {
    id: 'battle-1',
    name: "Dragon's Fury",
    description: "Unleash a devastating dragon attack that deals massive damage to all enemies",
    category: 'Battle',
    imageUrl: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    rank: 'LEGENDARY',
    starLevel: 4,
    stats: {
      attack: 85,
      defense: 40,
      health: 120,
      energy: 100
    }
  },
  {
    id: 'battle-2',
    name: "Shadow Strike",
    description: "A swift stealth attack that has a high chance of critical damage",
    category: 'Battle',
    imageUrl: 'https://images.unsplash.com/photo-1604076913837-52665539e8ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    rank: 'RARE',
    starLevel: 2,
    stats: {
      attack: 75,
      defense: 30,
      health: 90,
      energy: 110
    }
  },
  {
    id: 'battle-3',
    name: "Holy Shield",
    description: "Create a divine barrier that protects allies from incoming damage",
    category: 'Battle',
    imageUrl: 'https://images.unsplash.com/photo-1615673205257-2571e01a4a12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    rank: 'EPIC',
    starLevel: 3,
    stats: {
      attack: 30,
      defense: 95,
      health: 100,
      energy: 90
    }
  }
];

const initialCards: Card[] = [
  {
    id: '1',
    name: 'Warrior',
    description: 'A mighty warrior with great strength',
    imageUrl: '/cards/warrior.jpg',
    category: 'Starter',
    class: 'warrior',
    rank: 'COMMON',
    starLevel: 1,
    isStarter: true,
    stats: {
      attack: 15,
      defense: 10,
      health: 120,
      energy: 100
    }
  },
  {
    id: '2',
    name: 'Mage',
    description: 'A powerful spellcaster',
    imageUrl: '/cards/mage.jpg',
    category: 'Starter',
    class: 'mage',
    rank: 'COMMON',
    starLevel: 1,
    isStarter: true,
    stats: {
      attack: 20,
      defense: 5,
      health: 80,
      energy: 120
    }
  },
  {
    id: '3',
    name: 'Rogue',
    description: 'A swift and agile fighter',
    imageUrl: '/cards/rogue.jpg',
    category: 'Starter',
    class: 'rogue',
    rank: 'COMMON',
    starLevel: 1,
    isStarter: true,
    stats: {
      attack: 12,
      defense: 8,
      health: 90,
      energy: 110
    }
  }
];

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Basic cards for new players',
    grid: 'starter'
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Warrior class cards',
    grid: 'warrior'
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'Mage class cards',
    grid: 'mage'
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Rogue class cards',
    grid: 'rogue'
  },
  {
    id: 'battle',
    name: 'Battle',
    description: 'Cards used for battles',
    grid: 'battle'
  }
];

const DEFAULT_CLASSES: Class[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Masters of physical combat',
    abilities: ['Slash', 'Shield Block', 'Battle Cry']
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'Wielders of arcane magic',
    abilities: ['Fireball', 'Frost Nova', 'Arcane Intellect']
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Masters of stealth and precision',
    abilities: ['Backstab', 'Evasion', 'Poison Strike']
  }
];

const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Basic Training',
    description: 'A simple training task for beginners',
    requirements: {
      requiredStats: {
        energy: 10,
        health: 20
      },
      minimumLevel: 1
    },
    rewards: {
      health: 5,
      energy: 5,
      power: 1,
      defense: 1,
      experienceGain: 10,
      basePayment: 50
    },
    risks: {
      healthRisk: 5,
      energyCost: 10,
      failureChance: 10
    },
    cooldown: 300,
    lastCompleted: 0
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      cards: [],
      categories: [],
      classes: [],
      moves: [],
      selectedCard: null,
      selectedCharacter: null,
      characterImages: [],
      selectedImageIndex: 0,
      tasks: [],
      isLoggedIn: false,
      isAdmin: false,
      playerProfile: null,
      activePlayers: 0,
      totalMatches: 0,
      totalCards: 0,
      onlinePlayers: 0,
      leaderboard: [],
      matchHistory: [],
      currentMatches: [],

      initializeStore: () => {
        set((state) => {
          // Only initialize if the store is empty
          if (state.cards.length === 0) {
            return {
              ...state,
              cards: [...initialCards],
              categories: [
                {
                  id: 'starter',
                  name: 'Starter',
                  description: 'Basic cards for new players',
                  grid: 'starter'
                }
              ],
              classes: [
                {
                  id: 'warrior',
                  name: 'Warrior',
                  description: 'Masters of close combat',
                  abilities: ['Charge', 'Shield Block']
                },
                {
                  id: 'mage',
                  name: 'Mage',
                  description: 'Wielders of arcane magic',
                  abilities: ['Fireball', 'Frost Nova']
                },
                {
                  id: 'rogue',
                  name: 'Rogue',
                  description: 'Swift and deadly fighters',
                  abilities: ['Backstab', 'Stealth']
                }
              ]
            };
          }
          return state;
        });
      },

      addMove: (move: Move) => {
        set((state) => ({
          moves: [...(state.moves || []), { ...move, id: move.id || crypto.randomUUID() }]
        }));
      },

      updateMove: (id: string, updatedMove: Move) => {
        set((state) => ({
          moves: (state.moves || []).map((move) =>
            move.id === id ? { ...move, ...updatedMove } : move
          )
        }));
      },

      deleteMove: (id: string) => {
        set((state) => ({
          moves: (state.moves || []).filter((move) => move.id !== id)
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category]
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id)
        }));
      },

      addClass: (newClass) => {
        set((state) => ({
          classes: [...state.classes, newClass]
        }));
      },

      updateClass: (id, updates) => {
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === id ? { ...cls, ...updates } : cls
          )
        }));
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((cls) => cls.id !== id)
        }));
      },

      addCard: (card: Card) => {
        console.log('Adding new card:', card);
        
        // Validate card data
        if (!card.id) {
          card.id = crypto.randomUUID(); // Ensure an ID exists
        }

        if (!card.name) {
          console.error('Card must have a name');
          return false;
        }

        // Log detailed card data for debugging
        console.log('Card data validation:', {
          id: card.id,
          name: card.name,
          description: card.description,
          category: card.category,
          class: card.class,
          rank: card.rank,
          imageUrl: card.imageUrl,
          starLevel: card.starLevel,
          stats: card.stats
        });

        // Ensure all required fields have default values
        const newCard: Card = {
          id: card.id,
          name: card.name,
          description: card.description || '',
          category: card.category || 'Uncategorized',
          class: card.class || 'unknown',
          rank: card.rank || 'COMMON',
          imageUrl: card.imageUrl || '/default-card-image.png',
          starLevel: card.starLevel || 1,
          stats: {
            attack: card.stats?.attack || 10,
            defense: card.stats?.defense || 10,
            health: card.stats?.health || 100,
            energy: card.stats?.energy || 100
          }
        };

        // Validate newCard before adding
        const validationErrors = [];
        if (!newCard.name) validationErrors.push('Name is required');
        if (!newCard.category) validationErrors.push('Category is required');
        if (!newCard.class) validationErrors.push('Class is required');

        if (validationErrors.length > 0) {
          console.error('Card validation failed:', validationErrors);
          return false;
        }

        set((state) => {
          const updatedCards = [...state.cards, newCard];
          console.log('Updated cards after adding:', {
            totalCards: updatedCards.length,
            newCardAdded: newCard
          });
          return { cards: updatedCards, totalCards: state.totalCards + 1 };
        });

        return true;
      },

      updateCard: (updatedCard: Card) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          )
        }));
        toast.success('Card updated successfully!');
      },

      deleteCard: (id: string) => {
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
          totalCards: state.totalCards - 1
        }));
        toast.success('Card deleted successfully!');
      },

      getCardsByCategory: (category: string) => {
        return get().cards.filter((card) => card.category === category);
      },

      getCardsByGrid: (grid: string) => {
        const category = get().categories.find((cat) => cat.grid === grid);
        return category ? get().cards.filter((card) => card.category === category.id) : [];
      },

      getCardById: (id: string) => {
        return get().cards.find((card) => card.id === id);
      },

      getStarterCards: () => {
        return get().cards.filter((card) => card.isStarter);
      },

      setCardAsStarter: (cardId: string, isStarter = true) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, isStarter } : card
          )
        }));
      },

      setPlayerProfile: (profile: PlayerProfile) => {
        set({ playerProfile: profile });
      },

      selectCard: (cardId: string) => {
        const card = get().getCardById(cardId);
        const profile = get().playerProfile;
        
        if (card && profile?.character) {
          const updatedProfile = {
            ...profile,
            character: {
              ...profile.character,
              imageUrl: card.imageUrl,
              starRank: card.starLevel || profile.character.starRank,
              stats: {
                power: card.stats?.attack || profile.character.stats.power,
                energy: card.stats?.energy || profile.character.stats.energy,
                health: card.stats?.health || profile.character.stats.health,
                defense: card.stats?.defense || profile.character.stats.defense,
              }
            }
          };
          set({ 
            selectedCard: card,
            playerProfile: updatedProfile
          });
        } else {
          set({ selectedCard: card || null });
        }
      },

      updateCardStats: (cardId: string, stats: any) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, stats: { ...card.stats, ...stats } } : card
          )
        }));
      },

      getPlayerProfile: () => get().playerProfile,

      setSelectedCharacter: (character: Character) => {
        set({ selectedCharacter: character });
      },

      getSelectedCharacter: () => get().selectedCharacter,

      updateCharacterImages: (images: string[]) => {
        set({ characterImages: images });
      },

      selectCharacterImage: (index: number) => {
        set({ selectedImageIndex: index });
      },

      addTask: (task: Task) => {
        set((state) => ({
          tasks: [...state.tasks, task]
        }));
      },

      updateTask: (taskId: string, updatedTask: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          )
        }));
      },

      deleteTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        }));
      },

      updateTaskProgress: (taskId: string, progress: number) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, progress } : task
          )
        }));
      },

      completeTask: (taskId: string) => {
        const { tasks, playerProfile } = get();
        const task = tasks.find((t) => t.id === taskId);
        
        if (task && !task.completed) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: true, completedAt: new Date() } : t
            ),
            playerProfile: playerProfile ? {
              ...playerProfile,
              experience: (playerProfile.stats.experience || 0) + (task.rewards.experienceGain || 0),
              stats: {
                ...playerProfile.stats,
                coins: (playerProfile.stats.coins || 0) + (task.rewards.basePayment || 0)
              }
            } : null
          }));
        }
      },

      getActiveTasks: () => {
        return get().tasks.filter((task) => !task.completed);
      },

      getCompletedTasks: () => {
        return get().tasks.filter((task) => task.completed);
      },

      login: (isAdmin = false) => {
        set({ 
          isLoggedIn: true,
          isAdmin
        });

        // Sync with playerStore
        const playerStore = (window as any).playerStore;
        if (playerStore && playerStore.getState) {
          const { username } = playerStore.getState();
          if (!username) {
            playerStore.getState().login(isAdmin ? 'admin' : 'player');
          }
        }
      },

      logout: () => {
        set({ 
          isLoggedIn: false,
          isAdmin: false,
          playerProfile: null,
          selectedCard: null,
          selectedCharacter: null
        });

        // Sync with playerStore
        const playerStore = (window as any).playerStore;
        if (playerStore && playerStore.getState) {
          playerStore.getState().logout();
        }
      },

      resetStore: () => {
        set({ cards: [...DEFAULT_BATTLE_CARDS, ...initialCards], tasks: initialTasks, playerProfile: null });
        console.log('Store reset with initial cards:', [...DEFAULT_BATTLE_CARDS, ...initialCards]);
      },

      getGlobalMoves: (filters?: { class?: string, category?: Move['category'], type?: Move['type'] }) => {
        const state = get();
        const moves: Move[] = state.moves || [];

        if (!filters) return moves;

        return moves.filter(move => {
          const matchesClass = !filters.class || (move.classes && move.classes.includes(filters.class));
          const matchesCategory = !filters.category || move.category === filters.category;
          const matchesType = !filters.type || move.type === filters.type;

          return matchesClass && matchesCategory && matchesType;
        });
      },

      updateGlobalMove: (moveId: string, updatedMove: Partial<Move>) => {
        set((state) => ({
          moves: state.moves.map(move => 
            move.id === moveId ? { ...move, ...updatedMove } : move
          )
        }));
      },

      removeGlobalMove: (moveId: string) => {
        set((state) => ({
          moves: state.moves.filter(move => move.id !== moveId)
        }));
      },

      addCard: (card: Card) => {
        set((state) => ({
          cards: [...state.cards, card],
          totalCards: state.totalCards + 1,
        }));
        toast.success('Card added successfully!');
      },

      removeCard: (cardId: string) => {
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== cardId),
          totalCards: state.totalCards - 1,
        }));
        toast.success('Card deleted successfully!');
      },

      updateCard: (cardId: string, updates: Partial<Card>) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          ),
        }));
        toast.success('Card updated successfully!');
      },

      startMatch: (player1: string, player2: string, type: 'quick' | 'ranked' | 'practice') => {
        const matchId = Math.random().toString(36).substring(7);
        set((state) => ({
          currentMatches: [
            ...state.currentMatches,
            {
              id: matchId,
              player1,
              player2,
              type,
              startTime: Date.now(),
              status: 'in_progress',
            },
          ],
          totalMatches: state.totalMatches + 1,
        }));
        return matchId;
      },

      endMatch: (matchId: string, winner: string) => {
        const match = get().currentMatches.find((m) => m.id === matchId);
        if (!match) return;

        set((state) => ({
          currentMatches: state.currentMatches.filter((m) => m.id !== matchId),
          matchHistory: [
            ...state.matchHistory,
            {
              id: matchId,
              player1: match.player1,
              player2: match.player2,
              winner,
              timestamp: Date.now(),
              type: match.type,
              points: match.type === 'ranked' ? 20 : 10,
            },
          ],
        }));

        if (match.type === 'ranked') {
          get().updateLeaderboard(winner, 20);
        }
      },

      updateLeaderboard: (playerId: string, points: number) => {
        set((state) => {
          const existingPlayer = state.leaderboard.find((p) => p.id === playerId);
          if (existingPlayer) {
            return {
              leaderboard: state.leaderboard.map((p) =>
                p.id === playerId
                  ? { ...p, points: p.points + points }
                  : p
              ).sort((a, b) => b.points - a.points),
            };
          }
          return state;
        });
      },

      getPlayerRank: (playerId: string) => {
        const player = get().leaderboard.find((p) => p.id === playerId);
        return player ? player.rank : -1;
      },

      getMatchHistory: (playerId: string) => {
        return get().matchHistory.filter(
          (m) => m.player1 === playerId || m.player2 === playerId
        );
      },

      getCurrentMatches: () => {
        return get().currentMatches;
      },
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cards: state.cards,
        categories: state.categories,
        classes: state.classes,
        moves: state.moves,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin,
        playerProfile: state.playerProfile,
        activePlayers: state.activePlayers,
        totalMatches: state.totalMatches,
        totalCards: state.totalCards,
        onlinePlayers: state.onlinePlayers,
        leaderboard: state.leaderboard,
        matchHistory: state.matchHistory,
        currentMatches: state.currentMatches
      })
    }
  )
);

// Update online players count periodically
setInterval(() => {
  useGameStore.setState((state) => ({
    onlinePlayers: Math.floor(Math.random() * 100) + 50, // Simulated for demo
    activePlayers: state.leaderboard.length,
  }));
}, 60000);

// Make store available globally for syncing
if (typeof window !== 'undefined') {
  (window as any).gameStore = useGameStore;
}

export type { GameState };
