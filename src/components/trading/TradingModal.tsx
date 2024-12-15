import React, { useState } from 'react';
import { useTradingStore } from '../../store/tradingStore';
import { usePlayerStore } from '../../store/playerStore';
import { Card } from '../../types/card';
import { Player } from '../../types/player';
import { FaExchangeAlt, FaTimes, FaCheck } from 'react-icons/fa';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayer: Player;
}

const TradingModal: React.FC<TradingModalProps> = ({ 
  isOpen, 
  onClose, 
  currentPlayer 
}) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [selectedCoins, setSelectedCoins] = useState(0);
  const [selectedTradePartner, setSelectedTradePartner] = useState<Player | null>(null);

  const { players } = usePlayerStore();
  const { createTradeOffer } = useTradingStore();

  const availablePlayers = players.filter(p => p.id !== currentPlayer.id);

  const handleCardSelect = (card: Card) => {
    const isSelected = selectedCards.some(c => c.id === card.id);
    
    if (isSelected) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleCreateTradeOffer = async () => {
    if (!selectedTradePartner) {
      alert('Please select a trade partner');
      return;
    }

    const tradeOffer = await createTradeOffer(
      currentPlayer.id, 
      selectedTradePartner.id, 
      selectedCards, 
      [], // No cards from trade partner initially
      selectedCoins,
      0 // No coins from trade partner initially
    );

    if (tradeOffer) {
      alert('Trade offer sent!');
      onClose();
    } else {
      alert('Failed to create trade offer');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Trade Offer</h2>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-red-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Your Cards Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Cards</h3>
            <div className="grid grid-cols-3 gap-2">
              {currentPlayer.inventory.map(card => (
                <div 
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className={`
                    border-2 rounded-lg p-2 cursor-pointer transition-all
                    ${selectedCards.some(c => c.id === card.id) 
                      ? 'border-green-500 bg-green-100' 
                      : 'border-gray-300 hover:border-blue-500'
                    }
                  `}
                >
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-24 object-cover rounded-md" 
                  />
                  <p className="text-center mt-1">{card.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Partner Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Trade Partner</h3>
            <select 
              value={selectedTradePartner?.id || ''}
              onChange={(e) => {
                const partner = players.find(p => p.id === e.target.value);
                setSelectedTradePartner(partner || null);
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Trade Partner</option>
              {availablePlayers.map(player => (
                <option key={player.id} value={player.id}>
                  {player.username}
                </option>
              ))}
            </select>

            {/* Coins Input */}
            <div className="mt-4">
              <label className="block mb-2">Coins to Trade</label>
              <input 
                type="number" 
                value={selectedCoins}
                onChange={(e) => {
                  const coins = parseInt(e.target.value, 10);
                  setSelectedCoins(isNaN(coins) ? 0 : Math.max(0, Math.min(coins, currentPlayer.stats.coins)));
                }}
                max={currentPlayer.stats.coins}
                min={0}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {currentPlayer.stats.coins} coins
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
          <button 
            onClick={handleCreateTradeOffer}
            disabled={!selectedTradePartner || selectedCards.length === 0}
            className={`
              px-4 py-2 text-white rounded-md flex items-center
              ${!selectedTradePartner || selectedCards.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
              }
            `}
          >
            <FaExchangeAlt className="mr-2" /> Create Trade Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingModal;
