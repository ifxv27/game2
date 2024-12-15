import { useGameStore } from '../store/gameStore';
import { Card, CardRank } from '../types/card';
import { toast } from 'react-toastify';

export const useCards = () => {
  const gameStore = useGameStore();

  const addCard = (card: Card) => {
    try {
      const newCard: Card = {
        ...card,
        id: card.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        starRank: card.starRank || 1,
        cardRank: card.cardRank || CardRank.Common,
        stats: {
          hp: card.stats?.hp || 100,
          mp: card.stats?.mp || 100,
          attack: card.stats?.attack || 10,
          defense: card.stats?.defense || 10,
          speed: card.stats?.speed || 10,
          energy: card.stats?.energy || 100
        },
        skills: card.skills || []
      };
      
      gameStore.addCard(newCard);
      toast.success('Card added successfully');
    } catch (error) {
      toast.error('Failed to add card');
      console.error('Error adding card:', error);
    }
  };

  const updateCard = (card: Card) => {
    try {
      const updatedCard: Card = {
        ...card,
        updatedAt: new Date().toISOString(),
        stats: {
          hp: card.stats?.hp || 100,
          mp: card.stats?.mp || 100,
          attack: card.stats?.attack || 10,
          defense: card.stats?.defense || 10,
          speed: card.stats?.speed || 10,
          energy: card.stats?.energy || 100
        }
      };
      
      gameStore.updateCard(updatedCard);
      toast.success('Card updated successfully');
    } catch (error) {
      toast.error('Failed to update card');
      console.error('Error updating card:', error);
    }
  };

  const deleteCard = (cardId: string) => {
    try {
      gameStore.deleteCard(cardId);
      toast.success('Card deleted successfully');
    } catch (error) {
      toast.error('Failed to delete card');
      console.error('Error deleting card:', error);
    }
  };

  const bulkUpdateCards = (cards: Card[]) => {
    try {
      const timestamp = new Date().toISOString();
      cards.forEach(card => {
        const updatedCard: Card = {
          ...card,
          updatedAt: timestamp,
          stats: {
            hp: card.stats?.hp || 100,
            mp: card.stats?.mp || 100,
            attack: card.stats?.attack || 10,
            defense: card.stats?.defense || 10,
            speed: card.stats?.speed || 10,
            energy: card.stats?.energy || 100
          }
        };
        gameStore.updateCard(updatedCard);
      });
      toast.success(`Successfully updated ${cards.length} cards`);
    } catch (error) {
      toast.error('Failed to update some cards');
      console.error('Error in bulk update:', error);
    }
  };

  return {
    cards: gameStore.cards,
    addCard,
    updateCard,
    deleteCard,
    bulkUpdateCards,
  };
};

export default useCards;
