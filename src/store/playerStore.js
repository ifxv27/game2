import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlayerStore = create(
  persist(
    (set, get) => ({
      currentPlayer: null,
      isAuthenticated: false,
      players: [],

      createPlayer: (playerData) => {
        const { players } = get();
        const existingPlayer = players.find(
          p => p.username === playerData.username || p.email === playerData.email
        );

        if (existingPlayer) {
          return { success: false, error: 'Username or email already exists' };
        }

        const newPlayer = {
          id: Date.now().toString(),
          username: playerData.username,
          email: playerData.email,
          characterName: playerData.characterName,
          role: playerData.username === 'admin' ? 'admin' : 'player',
          selectedCard: playerData.selectedCard,
          stats: {
            ...playerData.stats,
            level: 1,
            experience: 0,
            gamesPlayed: 0,
            wins: 0,
            coins: 100
          },
          inventory: [],
          settings: {
            theme: 'dark',
            notifications: true
          },
          hasStarterCard: true
        };

        set(state => ({
          players: [...state.players, newPlayer],
          currentPlayer: newPlayer,
          isAuthenticated: true
        }));

        return { 
          success: true,
          isAdmin: newPlayer.role === 'admin'
        };
      },

      loginPlayer: (usernameOrCredentials, password) => {
        let credentials;
        
        // Handle both object and separate argument inputs
        if (typeof usernameOrCredentials === 'object') {
          credentials = usernameOrCredentials;
        } else {
          credentials = {
            username: usernameOrCredentials,
            password: password
          };
        }

        // Specific admin login check
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const adminPlayer = {
            id: 'admin',
            username: 'admin',
            characterName: 'Admin',
            role: 'admin',
            hasStarterCard: true,
            selectedCard: {
              name: 'Admin Card',
              starRank: 5,
              stats: {
                health: 100,
                attack: 100,
                defense: 100,
                energy: 100
              }
            },
            stats: {
              level: 99,
              experience: 9999,
              health: 100,
              attack: 100,
              defense: 100,
              energy: 100,
              coins: 9999,
              gamesPlayed: 0,
              wins: 0
            }
          };
          
          set({
            currentPlayer: adminPlayer,
            isAuthenticated: true
          });
          
          return { 
            success: true, 
            isAdmin: true,
            player: adminPlayer
          };
        }

        // Find existing player
        const { players } = get();
        const player = players.find(p => p.username === credentials.username);
        
        if (!player) {
          return { success: false, error: 'Player not found' };
        }

        // In a real app, we would check the password hash here
        set({
          currentPlayer: player,
          isAuthenticated: true
        });

        return { 
          success: true,
          isAdmin: player.role === 'admin'
        };
      },

      logoutPlayer: () => {
        set({
          currentPlayer: null,
          isAuthenticated: false
        });
      },

      updatePlayer: (updates) => {
        set((state) => ({
          currentPlayer: state.currentPlayer ? {
            ...state.currentPlayer,
            ...updates
          } : null
        }));
      },

      setStarterCardSelected: (selected) => {
        set((state) => ({
          currentPlayer: state.currentPlayer ? {
            ...state.currentPlayer,
            hasStarterCard: selected
          } : null
        }));
      },

      deletePlayer: (playerId) => set((state) => {
        if (state.currentPlayer?.id === playerId) {
          return {
            players: state.players.filter(p => p.id !== playerId),
            currentPlayer: null,
            isAuthenticated: false
          };
        }
        return {
          players: state.players.filter(p => p.id !== playerId)
        };
      }),

      addCharacter: (playerId, character) => set((state) => {
        const player = state.players.find(p => p.id === playerId);
        if (!player) return state;

        const updatedPlayers = state.players.map(p => 
          p.id === playerId 
            ? { ...p, characters: [...(p.characters || []), character] }
            : p
        );

        return {
          ...state,
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.id === playerId 
            ? { ...state.currentPlayer, characters: [...(state.currentPlayer.characters || []), character] }
            : state.currentPlayer
        };
      }),

      updateStats: (playerId, stats) => set((state) => {
        const updatedPlayers = state.players.map(p => 
          p.id === playerId 
            ? { ...p, stats: { ...(p.stats || {}), ...stats } }
            : p
        );

        return {
          ...state,
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.id === playerId 
            ? { ...state.currentPlayer, stats: { ...(state.currentPlayer.stats || {}), ...stats } }
            : state.currentPlayer
        };
      }),

      updateSettings: (playerId, settings) => set((state) => {
        const updatedPlayers = state.players.map(p => 
          p.id === playerId 
            ? { ...p, settings: { ...(p.settings || {}), ...settings } }
            : p
        );

        return {
          ...state,
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.id === playerId 
            ? { ...state.currentPlayer, settings: { ...(state.currentPlayer.settings || {}), ...settings } }
            : state.currentPlayer
        };
      }),

      createCharacter: (playerId, characterData) => set((state) => {
        const player = state.players.find(p => p.id === playerId);
        if (!player) return state;

        const newCharacter = {
          id: characterData.id,
          name: characterData.name,
          class: characterData.class,
          level: 1,
          experience: 0,
          stats: {
            health: characterData.baseStats?.health || 100,
            energy: characterData.baseStats?.energy || 100,
            power: characterData.baseStats?.power || 10,
            defense: characterData.baseStats?.defense || 10
          }
        };

        const updatedPlayers = state.players.map(p => 
          p.id === playerId 
            ? { ...p, character: newCharacter }
            : p
        );

        return {
          ...state,
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.id === playerId 
            ? { ...state.currentPlayer, character: newCharacter }
            : state.currentPlayer
        };
      })
    }),
    {
      name: 'player-storage',
      version: 1,
    }
  )
);

export { usePlayerStore };
export default usePlayerStore;
