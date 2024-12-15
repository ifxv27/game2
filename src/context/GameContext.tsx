import React, { createContext, useContext, useState } from 'react';

interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  category: string;
  starRank: number;
  stats: {
    attack: number;
    defense: number;
    health: number;
    energy: number;
  };
}

interface GameContextType {
  cards: Card[];
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Sample starter cards data
const initialCards: Card[] = [
  {
    id: '1',
    name: 'Seductive Sorceress',
    imageUrl: '/cards/card1.jpg',
    type: 'Starter Card',
    category: 'Starter Cards',
    starRank: 3,
    stats: {
      attack: 15,
      defense: 12,
      health: 100,
      energy: 100
    }
  },
  {
    id: '2',
    name: 'Mystic Enchantress',
    imageUrl: '/cards/card2.jpg',
    type: 'Starter Card',
    category: 'Starter Cards',
    starRank: 3,
    stats: {
      attack: 12,
      defense: 15,
      health: 100,
      energy: 100
    }
  },
  {
    id: '3',
    name: 'Shadow Assassin',
    imageUrl: '/cards/card3.jpg',
    type: 'Starter Card',
    category: 'Starter Cards',
    starRank: 3,
    stats: {
      attack: 18,
      defense: 10,
      health: 90,
      energy: 110
    }
  },
  {
    id: '4',
    name: 'Celestial Guardian',
    imageUrl: '/cards/card4.jpg',
    type: 'Starter Card',
    category: 'Starter Cards',
    starRank: 3,
    stats: {
      attack: 10,
      defense: 18,
      health: 110,
      energy: 90
    }
  }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const addCard = (card: Card) => {
    setCards(prevCards => [...prevCards, card]);
  };

  const removeCard = (cardId: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };

  return (
    <GameContext.Provider value={{ cards, addCard, removeCard }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameStore = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameStore must be used within a GameProvider');
  }
  return context;
};
