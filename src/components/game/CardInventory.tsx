import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Card } from '../../store/gameStore';
import { FaStar, FaHeart, FaBolt, FaShieldAlt, FaCheck } from 'react-icons/fa';

const CardInventory: React.FC = () => {
  const { currentPlayer, setActiveCard } = usePlayerStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  if (!currentPlayer) return null;

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
  };

  const handleActivateCard = () => {
    if (selectedCard && currentPlayer) {
      setActiveCard(currentPlayer.id, selectedCard.id);
      setSelectedCard(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Card Display */}
      {currentPlayer.activeCard && (
        <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
          <h2 className="text-xl font-bold text-purple-300 mb-4">Active Card</h2>
          <div className="flex gap-4">
            <div className="relative w-48 h-48">
              <img
                src={currentPlayer.activeCard.imageUrl}
                alt={currentPlayer.activeCard.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <FaCheck className="w-3 h-3" /> Active
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{currentPlayer.activeCard.name}</h3>
              <p className="text-gray-300 text-sm mt-1">{currentPlayer.activeCard.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-red-400">
                  <FaHeart /> {currentPlayer.activeCard.stats?.health || 100} HP
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <FaBolt /> {currentPlayer.activeCard.stats?.attack || 10} Power
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <FaBolt /> {currentPlayer.activeCard.stats?.energy || 100} Energy
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <FaShieldAlt /> {currentPlayer.activeCard.stats?.defense || 5} Defense
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Selection Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Activate Card</h2>
            <div className="relative w-full h-64 mb-4">
              <img
                src={selectedCard.imageUrl}
                alt={selectedCard.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-bold text-white">{selectedCard.name}</h3>
            <p className="text-gray-300 text-sm mt-1 mb-4">{selectedCard.description}</p>
            <div className="flex gap-2">
              <button
                onClick={handleActivateCard}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Activate Card
              </button>
              <button
                onClick={() => setSelectedCard(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Card Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPlayer.inventory.map((card) => (
            <div
              key={card.id}
              className={`p-4 border rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                currentPlayer.activeCard?.id === card.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : selectedCard?.id === card.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-500/30 hover:border-purple-300'
              }`}
              onClick={() => handleSelectCard(card)}
            >
              <div className="relative">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {currentPlayer.activeCard?.id === card.id && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaCheck className="w-3 h-3" /> Active
                  </div>
                )}
                <div className="absolute top-2 left-2 flex">
                  {[...Array(card.starLevel || 1)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                  ))}
                </div>
              </div>
              <div className="mt-2 text-white">
                <h3 className="font-bold">{card.name}</h3>
                <div className="grid grid-cols-2 gap-1 mt-2 text-sm">
                  <div className="flex items-center gap-1 text-red-400">
                    <FaHeart className="w-3 h-3" /> {card.stats?.health || 100}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FaBolt className="w-3 h-3" /> {card.stats?.attack || 10}
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <FaBolt className="w-3 h-3" /> {card.stats?.energy || 100}
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <FaShieldAlt className="w-3 h-3" /> {card.stats?.defense || 5}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardInventory;
