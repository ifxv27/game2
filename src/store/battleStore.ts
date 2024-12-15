import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface BattleState {
  id: string;
  type: 'pvp' | 'pve';
  status: 'waiting' | 'in-progress' | 'completed';
  player1: {
    id: string;
    cards: string[];
    currentCard: string | null;
    health: number;
    energy: number;
  };
  player2: {
    id: string;
    cards: string[];
    currentCard: string | null;
    health: number;
    energy: number;
  };
  turn: number;
  winner: string | null;
  rewards: {
    experience: number;
    gold: number;
    items: string[];
  };
}

interface BattleStore {
  currentBattle: BattleState | null;
  battleHistory: BattleState[];
  startBattle: (
    type: 'pvp' | 'pve',
    player1Id: string,
    player2Id: string,
    player1Cards: string[],
    player2Cards: string[]
  ) => void;
  playCard: (playerId: string, cardId: string) => void;
  useMove: (playerId: string, moveId: string, targetId: string) => void;
  endTurn: () => void;
  endBattle: (winnerId: string) => void;
  forfeitBattle: (playerId: string) => void;
  getBattleHistory: (playerId: string) => BattleState[];
  getCurrentBattle: (playerId: string) => BattleState | null;
}

export const useBattleStore = create<BattleStore>()(
  persist(
    (set, get) => ({
      currentBattle: null,
      battleHistory: [],

      startBattle: (type, player1Id, player2Id, player1Cards, player2Cards) => {
        const newBattle: BattleState = {
          id: Date.now().toString(),
          type,
          status: 'waiting',
          player1: {
            id: player1Id,
            cards: player1Cards,
            currentCard: null,
            health: 100,
            energy: 100,
          },
          player2: {
            id: player2Id,
            cards: player2Cards,
            currentCard: null,
            health: 100,
            energy: 100,
          },
          turn: 1,
          winner: null,
          rewards: {
            experience: 0,
            gold: 0,
            items: [],
          },
        };

        set({ currentBattle: newBattle });
        toast.success('Battle started!');
      },

      playCard: (playerId, cardId) => {
        set((state) => {
          if (!state.currentBattle) return state;

          const isPlayer1 = playerId === state.currentBattle.player1.id;
          const player = isPlayer1
            ? state.currentBattle.player1
            : state.currentBattle.player2;

          if (!player.cards.includes(cardId)) {
            toast.error('Card not in player\'s deck');
            return state;
          }

          return {
            currentBattle: {
              ...state.currentBattle,
              [isPlayer1 ? 'player1' : 'player2']: {
                ...player,
                currentCard: cardId,
              },
              status: 'in-progress',
            },
          };
        });
        toast.success('Card played!');
      },

      useMove: (playerId, moveId, targetId) => {
        set((state) => {
          if (!state.currentBattle) return state;

          // Implement move logic here
          // This would include checking move validity, applying damage/effects,
          // updating health/energy, etc.

          return state;
        });
      },

      endTurn: () => {
        set((state) => {
          if (!state.currentBattle) return state;

          return {
            currentBattle: {
              ...state.currentBattle,
              turn: state.currentBattle.turn + 1,
            },
          };
        });
        toast.info('Turn ended');
      },

      endBattle: (winnerId) => {
        set((state) => {
          if (!state.currentBattle) return state;

          const completedBattle: BattleState = {
            ...state.currentBattle,
            status: 'completed',
            winner: winnerId,
            rewards: {
              experience: 100, // Base rewards, could be calculated based on battle type/duration
              gold: 50,
              items: [],
            },
          };

          return {
            currentBattle: null,
            battleHistory: [...state.battleHistory, completedBattle],
          };
        });
        toast.success('Battle completed!');
      },

      forfeitBattle: (playerId) => {
        set((state) => {
          if (!state.currentBattle) return state;

          const opponent =
            playerId === state.currentBattle.player1.id
              ? state.currentBattle.player2.id
              : state.currentBattle.player1.id;

          const completedBattle: BattleState = {
            ...state.currentBattle,
            status: 'completed',
            winner: opponent,
            rewards: {
              experience: 0,
              gold: 0,
              items: [],
            },
          };

          return {
            currentBattle: null,
            battleHistory: [...state.battleHistory, completedBattle],
          };
        });
        toast.info('Battle forfeited');
      },

      getBattleHistory: (playerId) => {
        const state = get();
        return state.battleHistory.filter(
          (battle) =>
            battle.player1.id === playerId || battle.player2.id === playerId
        );
      },

      getCurrentBattle: (playerId) => {
        const state = get();
        if (!state.currentBattle) return null;

        if (
          state.currentBattle.player1.id === playerId ||
          state.currentBattle.player2.id === playerId
        ) {
          return state.currentBattle;
        }

        return null;
      },
    }),
    {
      name: 'battle-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
