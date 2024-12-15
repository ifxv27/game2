import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'moderator';
  permissions: string[];
}

interface GameStats {
  totalPlayers: number;
  activePlayers: number;
  totalMatches: number;
  activeMatches: number;
}

interface AdminState {
  currentAdmin: AdminUser | null;
  admins: AdminUser[];
  gameStats: GameStats;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  addAdmin: (admin: AdminUser) => void;
  removeAdmin: (id: string) => void;
  updateAdmin: (id: string, updates: Partial<AdminUser>) => void;
  updateGameStats: (stats: Partial<GameStats>) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      currentAdmin: null,
      admins: [],
      isAuthenticated: false,
      gameStats: {
        totalPlayers: 0,
        activePlayers: 0,
        totalMatches: 0,
        activeMatches: 0,
      },

      login: async (username: string, password: string) => {
        // In a real application, this would make an API call
        // For now, we'll simulate authentication
        if (username === 'admin' && password === 'admin') {
          set({
            currentAdmin: {
              id: '1',
              username: 'admin',
              role: 'admin',
              permissions: ['all'],
            },
            isAuthenticated: true,
          });
          toast.success('Successfully logged in as admin');
        } else {
          toast.error('Invalid credentials');
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        set({
          currentAdmin: null,
          isAuthenticated: false,
        });
        toast.success('Successfully logged out');
      },

      addAdmin: (admin) => {
        set((state) => ({
          admins: [...state.admins, admin],
        }));
        toast.success('Admin added successfully');
      },

      removeAdmin: (id) => {
        set((state) => ({
          admins: state.admins.filter((admin) => admin.id !== id),
        }));
        toast.success('Admin removed successfully');
      },

      updateAdmin: (id, updates) => {
        set((state) => ({
          admins: state.admins.map((admin) =>
            admin.id === id ? { ...admin, ...updates } : admin
          ),
        }));
        toast.success('Admin updated successfully');
      },

      updateGameStats: (stats) => {
        set((state) => ({
          gameStats: {
            ...state.gameStats,
            ...stats,
          },
        }));
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAdminStore;
