import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { TradeOffer, validateTradeOffer } from '../types/trading';
import { usePlayerStore } from './playerStore';
import { useGameStore } from './gameStore';

interface TradingStore {
  tradeOffers: TradeOffer[];
  createTradeOffer: (
    senderPlayerId: string, 
    receiverPlayerId: string, 
    senderCards: Card[], 
    receiverCards: Card[], 
    senderCoins?: number, 
    receiverCoins?: number
  ) => Promise<TradeOffer | null>;
  acceptTradeOffer: (tradeOfferId: string) => Promise<boolean>;
  rejectTradeOffer: (tradeOfferId: string) => Promise<boolean>;
  cancelTradeOffer: (tradeOfferId: string) => Promise<boolean>;
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  tradeOffers: [],

  createTradeOffer: async (
    senderPlayerId, 
    receiverPlayerId, 
    senderCards, 
    receiverCards, 
    senderCoins = 0, 
    receiverCoins = 0
  ) => {
    const playerStore = usePlayerStore.getState();
    const gameStore = useGameStore.getState();

    const senderPlayer = playerStore.players.find(p => p.id === senderPlayerId);
    const receiverPlayer = playerStore.players.find(p => p.id === receiverPlayerId);

    if (!senderPlayer || !receiverPlayer) {
      console.error('Invalid players for trade');
      return null;
    }

    const tradeOffer: TradeOffer = {
      id: uuidv4(),
      sender: {
        playerId: senderPlayerId,
        cards: senderCards,
        coins: senderCoins
      },
      receiver: {
        playerId: receiverPlayerId,
        cards: receiverCards,
        coins: receiverCoins
      },
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const validationResult = validateTradeOffer(tradeOffer, senderPlayer, receiverPlayer);

    if (!validationResult.isValid) {
      console.error('Trade offer validation failed:', validationResult.errors);
      return null;
    }

    set(state => ({
      tradeOffers: [...state.tradeOffers, tradeOffer]
    }));

    return tradeOffer;
  },

  acceptTradeOffer: async (tradeOfferId) => {
    const playerStore = usePlayerStore.getState();
    const { tradeOffers } = get();

    const tradeOffer = tradeOffers.find(offer => offer.id === tradeOfferId);
    if (!tradeOffer || tradeOffer.status !== 'pending') {
      console.error('Invalid trade offer');
      return false;
    }

    const senderPlayer = playerStore.players.find(p => p.id === tradeOffer.sender.playerId);
    const receiverPlayer = playerStore.players.find(p => p.id === tradeOffer.receiver.playerId);

    if (!senderPlayer || !receiverPlayer) {
      console.error('Players not found');
      return false;
    }

    // Perform the trade
    const updatedSenderPlayer = {
      ...senderPlayer,
      inventory: [
        ...senderPlayer.inventory.filter(card => 
          !tradeOffer.sender.cards.some(tradeCard => tradeCard.id === card.id)
        ),
        ...tradeOffer.receiver.cards
      ],
      stats: {
        ...senderPlayer.stats,
        coins: senderPlayer.stats.coins - (tradeOffer.sender.coins || 0) + (tradeOffer.receiver.coins || 0)
      }
    };

    const updatedReceiverPlayer = {
      ...receiverPlayer,
      inventory: [
        ...receiverPlayer.inventory.filter(card => 
          !tradeOffer.receiver.cards.some(tradeCard => tradeCard.id === card.id)
        ),
        ...tradeOffer.sender.cards
      ],
      stats: {
        ...receiverPlayer.stats,
        coins: receiverPlayer.stats.coins - (tradeOffer.receiver.coins || 0) + (tradeOffer.sender.coins || 0)
      }
    };

    // Update players
    await playerStore.updatePlayer(updatedSenderPlayer);
    await playerStore.updatePlayer(updatedReceiverPlayer);

    // Update trade offer status
    set(state => ({
      tradeOffers: state.tradeOffers.map(offer => 
        offer.id === tradeOfferId 
          ? { ...offer, status: 'completed', updatedAt: new Date() } 
          : offer
      )
    }));

    return true;
  },

  rejectTradeOffer: async (tradeOfferId) => {
    const { tradeOffers } = get();
    const tradeOffer = tradeOffers.find(offer => offer.id === tradeOfferId);

    if (!tradeOffer || tradeOffer.status !== 'pending') {
      console.error('Invalid trade offer');
      return false;
    }

    set(state => ({
      tradeOffers: state.tradeOffers.map(offer => 
        offer.id === tradeOfferId 
          ? { ...offer, status: 'rejected', updatedAt: new Date() } 
          : offer
      )
    }));

    return true;
  },

  cancelTradeOffer: async (tradeOfferId) => {
    const { tradeOffers } = get();
    const tradeOffer = tradeOffers.find(offer => offer.id === tradeOfferId);

    if (!tradeOffer || tradeOffer.status !== 'pending') {
      console.error('Invalid trade offer');
      return false;
    }

    set(state => ({
      tradeOffers: state.tradeOffers.map(offer => 
        offer.id === tradeOfferId 
          ? { ...offer, status: 'cancelled', updatedAt: new Date() } 
          : offer
      )
    }));

    return true;
  }
}));
