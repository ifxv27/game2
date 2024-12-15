import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CARD_RANKS = {
  COMMON: { value: 1, stars: '⭐' },
  RARE: { value: 2, stars: '⭐⭐' },
  EPIC: { value: 3, stars: '⭐⭐⭐' },
  LEGEND: { value: 4, stars: '⭐⭐⭐⭐' }
};

const DEFAULT_CATEGORIES = [
  { id: 'Battle', name: 'Battle Cards', description: 'Cards used for battles', grid: 'battle' },
  { id: 'Player', name: 'Player Cards', description: 'Cards for player characters', grid: 'player' },
  { id: 'Starter', name: 'Starter Cards', description: 'Initial cards for new players', grid: 'starter' },
  { id: 'Store', name: 'Store Cards', description: 'Cards available in the store', grid: 'store' },
  { id: 'Event', name: 'Event Cards', description: 'Special event cards', grid: 'event' }
];

const DEFAULT_CLASSES = [
  { id: 'warrior', name: 'Warrior', description: 'Strong melee fighter', abilities: ['Strike', 'Block'] },
  { id: 'mage', name: 'Mage', description: 'Powerful spellcaster', abilities: ['Fireball', 'Shield'] },
  { id: 'rogue', name: 'Rogue', description: 'Swift and stealthy', abilities: ['Backstab', 'Dodge'] }
];

// Add some default starter cards
const defaultCards = [
  {
    id: 'starter-warrior',
    name: 'Novice Warrior',
    starRank: 1,
    cardRank: 'Common',
    imageUrl: 'https://image.cdn2.seaart.ai/2024-01-17/30720658267439105/b0c9c3c6f5c7c8e1d6b3c7a2d4b5c8a1.png',
    description: 'A beginning warrior ready for adventure',
    power: 10,
    defense: 10,
    speed: 10,
    category: 'Starter',  // Make sure this matches the CardCategory type
    class: 'warrior',
    skills: ['Basic Attack'],
    level: 1,
    health: 100,
    energy: 100,
    attack: 15,
    special: 5
  },
  {
    id: 'starter-mage',
    name: 'Apprentice Mage',
    starRank: 1,
    cardRank: 'Common',
    imageUrl: 'https://image.cdn2.seaart.ai/2024-01-17/30720658267439105/f9e8d7c6b5a4c3b2a1d0e9f8c7b6a5d4.png',
    description: 'A mystical spellcaster beginning their journey',
    power: 8,
    defense: 6,
    speed: 8,
    category: 'Starter',  // Make sure this matches the CardCategory type
    class: 'mage',
    skills: ['Magic Missile'],
    level: 1,
    health: 80,
    energy: 120,
    attack: 12,
    special: 8
  }
];

export const useGameStore = create(
  persist(
    (set, get) => ({
      // State
      cards: [],  // Initialize with empty cards
      playerProfile: null,
      selectedCharacter: null,
      classes: DEFAULT_CLASSES,
      categories: DEFAULT_CATEGORIES,
      tasks: [],
      isAdmin: false,
      isLoggedIn: false,

      // Initialize store with default cards if empty
      initializeStore: () => {
        const state = get();
        console.log('Current cards in store:', state.cards); // Debug log
        console.log('Current categories:', state.categories); // Debug log
        if (!state.cards || state.cards.length === 0) {
          console.log('Initializing store with default cards:', defaultCards);
          set({ cards: defaultCards });
        } else {
          console.log('Store already has cards:', state.cards.map(card => ({ name: card.name, category: card.category })));
        }
      },

      // Category Management
      addCategory: (category) => {
        const newCategory = {
          ...category,
          id: category.id || `category-${Date.now()}`,
          grid: category.grid || category.name.toLowerCase()
        };
        set(state => ({
          categories: [...state.categories, newCategory]
        }));
        return newCategory;
      },

      updateCategory: (id, updates) => {
        set(state => ({
          categories: state.categories.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },

      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },

      // Class Management
      addClass: (newClass) => {
        const classWithId = {
          ...newClass,
          id: newClass.id || `class-${Date.now()}`,
          abilities: newClass.abilities || []
        };
        set(state => ({
          classes: [...state.classes, classWithId]
        }));
        return classWithId;
      },

      updateClass: (id, updates) => {
        set(state => ({
          classes: state.classes.map(cls =>
            cls.id === id ? { ...cls, ...updates } : cls
          )
        }));
      },

      deleteClass: (id) => {
        set(state => ({
          classes: state.classes.filter(cls => cls.id !== id)
        }));
      },

      // Card Management
      addCard: (card) => {
        console.log('Adding card:', card); // Debug log
        set(state => {
          const newCards = [...state.cards, { ...card, id: card.id || `card-${Date.now()}` }];
          console.log('Updated cards array:', newCards); // Debug log
          return { cards: newCards };
        });
      },

      updateCard: (updatedCard) => {
        set(state => ({
          cards: state.cards.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          )
        }));
      },

      deleteCard: (id) => {
        set(state => ({
          cards: state.cards.filter(card => card.id !== id)
        }));
      },

      getCardsByCategory: (category) => {
        console.log('Getting cards by category:', category); // Debug log
        console.log('All cards:', get().cards); // Debug log
        const upperCategory = category.toUpperCase();
        return get().cards.filter(card => {
          const cardCategory = card.category?.toUpperCase();
          console.log('Comparing card category:', cardCategory, 'with:', upperCategory); // Debug log
          return cardCategory === upperCategory;
        });
      },

      getCardsByGrid: (grid) => {
        const state = get();
        return state.cards.filter(card => {
          const category = state.categories.find(cat => cat.id === card.category);
          return category?.grid === grid;
        });
      },

      getCardById: (id) => {
        return get().cards.find(card => card.id === id);
      },

      getStarterCards: () => {
        const state = get();
        console.log('Getting starter cards from state:', state.cards); // Debug log
        const starterCards = state.cards.filter(card => card.category === 'Starter');
        console.log('Found starter cards:', starterCards); // Debug log
        return starterCards;
      },

      setCardAsStarter: (cardId, isStarter = true) => {
        set(state => ({
          cards: state.cards.map(card =>
            card.id === cardId
              ? { ...card, category: isStarter ? 'Starter' : card.category }
              : card
          )
        }));
      },

      // Player Profile Management
      setPlayerProfile: (profile) => {
        // Ensure the character's selected card is properly set
        if (profile?.character?.selectedCard) {
          set({ playerProfile: profile });
        } else if (profile?.character) {
          // If there's a character but no selected card, try to get their first card
          const updatedProfile = {
            ...profile,
            character: {
              ...profile.character,
              selectedCard: profile.character // The card data should already be in the character
            }
          };
          set({ playerProfile: updatedProfile });
        } else {
          set({ playerProfile: profile });
        }
      },

      selectCard: (cardId) => {
        const { cards, playerProfile } = get();
        const selectedCard = cards.find(card => card.id === cardId);
        
        if (selectedCard && playerProfile) {
          set({
            playerProfile: {
              ...playerProfile,
              selectedCard
            }
          });
        }
      },

      updateCardStats: (cardId, stats) => {
        const { cards } = get();
        set({
          cards: cards.map(card => 
            card.id === cardId 
              ? { 
                  ...card, 
                  stats: { 
                    ...(card.stats || {}), 
                    ...stats 
                  } 
                }
              : card
          )
        });
      },

      getPlayerProfile: () => get().playerProfile,

      // Character Management
      setSelectedCharacter: (character) => set({ selectedCharacter: character }),
      getSelectedCharacter: () => get().selectedCharacter,

      // Character Image Management
      updateCharacterImages: (images) => {
        set((state) => ({
          playerProfile: {
            ...state.playerProfile,
            character: {
              ...state.playerProfile.character,
              images: images
            }
          }
        }));
      },

      selectCharacterImage: (index) => {
        set((state) => ({
          playerProfile: {
            ...state.playerProfile,
            character: {
              ...state.playerProfile.character,
              selectedImage: index
            }
          }
        }));
      },

      // Task Management
      addTask: (task) => set(state => ({
        tasks: [...state.tasks, { ...task, id: task.id || `task-${Date.now()}` }]
      })),

      updateTask: (taskId, updatedTask) => set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      })),

      deleteTask: (taskId) => set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),

      updateTaskProgress: (taskId, progress) => set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, progress } : task
        )
      })),

      completeTask: (taskId) => {
        const state = get();
        if (taskId === 'lucky-roll-daily') {
          // Handle lucky roll completion
          localStorage.setItem('lastLuckyRoll', new Date().toISOString().split('T')[0]);
          // Roll for a card using the configured chances
          const dailyTaskStore = useDailyTaskStore.getState();
          const playerProfile = state.playerProfile;
          const result = dailyTaskStore.rollLuckyCard(playerProfile?.inventory || []);
          
          if (result) {
            // Add the card to player's inventory
            set(state => ({
              playerProfile: {
                ...state.playerProfile,
                inventory: [...(state.playerProfile?.inventory || []), result]
              }
            }));
          }
        } else {
          // Handle other tasks
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === taskId ? { ...task, completed: true } : task
            )
          }));
        }
      },

      getActiveTasks: () => {
        const state = get();
        const tasks = [...(state.tasks || [])];
        
        // Add lucky roll as a daily task if it hasn't been completed today
        const today = new Date().toISOString().split('T')[0];
        const lastLuckyRoll = localStorage.getItem('lastLuckyRoll');
        
        if (lastLuckyRoll !== today) {
          tasks.unshift({
            id: 'lucky-roll-daily',
            title: 'Daily Lucky Roll',
            description: 'Roll for a chance to get a rare card!',
            category: 'DAILY',
            imageUrl: 'https://image.cdn2.seaart.me/2024-11-24/ct1p4ale878c73928nf0/89ec594ae954bb2483863a8e9558a3f0_high.webp',
            progress: 0,
            timeLimit: '24h',
            reward: 'Random Card',
            type: 'lucky-roll',
            completed: false
          });
        }
        
        return tasks.filter(task => !task.completed);
      },

      getCompletedTasks: () => {
        const state = get();
        return state.tasks.filter(task => task.completed);
      },

      // Auth Management
      login: (isAdmin = false) => {
        set({ isLoggedIn: true, isAdmin });
      },

      logout: () => {
        set({ isLoggedIn: false, isAdmin: false, playerProfile: null });
      },
    }),
    {
      name: 'game-storage',
      version: 1,
    }
  )
);
