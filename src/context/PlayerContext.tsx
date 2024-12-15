import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface PlayerStats {
  level: number;
  experience: number;
  health: number;
  energy: number;
  attack: number;
  defense: number;
  speed: number;
}

interface Player {
  id: string;
  username: string;
  stats: PlayerStats;
  cards: any[];
  selectedCard: string;
}

interface PlayerContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  isLoading: boolean;
  error: string | null;
  createPlayer: (playerData: any) => { success: boolean; error?: string };
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(() => {
    // Try to get the player from localStorage on initial load
    const savedPlayer = localStorage.getItem('player');
    return savedPlayer ? JSON.parse(savedPlayer) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to check token and load player data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !player) {
      fetchPlayerData(token);
    }
  }, []);

  const fetchPlayerData = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/players/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPlayer(data.player);
        localStorage.setItem('player', JSON.stringify(data.player));
      } else {
        // If token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('player');
        setPlayer(null);
      }
    } catch (err) {
      setError('Failed to fetch player data');
      console.error('Error fetching player data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlayer = (playerData: any) => {
    try {
      // Create a new player with default stats
      const newPlayer = {
        id: Date.now().toString(), // Temporary ID until backend integration
        username: playerData.username,
        selectedCard: playerData.selectedCard,
        stats: {
          level: 1,
          experience: 0,
          health: 100,
          energy: 100,
          attack: 10,
          defense: 10,
          speed: 10
        },
        cards: [playerData.selectedCard] // Add the selected card to the player's deck
      };

      // Set the new player in state
      setPlayer(newPlayer);
      
      // Store in localStorage
      localStorage.setItem('player', JSON.stringify(newPlayer));
      
      return { success: true };
    } catch (err) {
      console.error('Error creating player:', err);
      return { success: false, error: 'Failed to create player' };
    }
  };

  return (
    <PlayerContext.Provider value={{ player, setPlayer, isLoading, error, createPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
