import { Card } from './card';
import { Player } from './player';

export interface TradeOffer {
  id: string;
  sender: {
    playerId: string;
    cards: Card[];
    coins?: number;
  };
  receiver: {
    playerId: string;
    cards: Card[];
    coins?: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTradeOffer(
  offer: TradeOffer, 
  senderPlayer: Player, 
  receiverPlayer: Player
): TradeValidationResult {
  const errors: string[] = [];

  // Validate sender's cards
  if (offer.sender.cards.length === 0) {
    errors.push('Sender must offer at least one card');
  }

  // Check if sender actually owns the cards they're offering
  const senderCardIds = new Set(senderPlayer.inventory.map(card => card.id));
  const invalidSenderCards = offer.sender.cards.filter(card => !senderCardIds.has(card.id));
  if (invalidSenderCards.length > 0) {
    errors.push('Sender is offering cards they do not own');
  }

  // Similar validation for receiver
  if (offer.receiver.cards.length === 0) {
    errors.push('Receiver must offer at least one card');
  }

  const receiverCardIds = new Set(receiverPlayer.inventory.map(card => card.id));
  const invalidReceiverCards = offer.receiver.cards.filter(card => !receiverCardIds.has(card.id));
  if (invalidReceiverCards.length > 0) {
    errors.push('Receiver is offering cards they do not own');
  }

  // Coin trade validation
  if ((offer.sender.coins || 0) < 0 || (offer.receiver.coins || 0) < 0) {
    errors.push('Cannot trade negative coins');
  }

  if ((offer.sender.coins || 0) > senderPlayer.stats.coins) {
    errors.push('Sender does not have enough coins');
  }

  if ((offer.receiver.coins || 0) > receiverPlayer.stats.coins) {
    errors.push('Receiver does not have enough coins');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
