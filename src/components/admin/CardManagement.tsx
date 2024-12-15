import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../types/card';
import { FaPlus, FaEdit, FaTrash, FaStar, FaFilter } from 'react-icons/fa';
import CardCreationModal from './CardCreationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const CardManagement: React.FC = () => {
  const store = useGameStore();
  const cards = useGameStore((state) => state.cards || []);
  const categories = ['Attack', 'Defense', 'Support', 'Special'];
  const classes = ['Warrior', 'Mage', 'Rogue', 'Priest'];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const handleAddCard = (card: Card) => {
    store.addCard({
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsCardModalOpen(false);
    toast.success('Card added successfully!');
  };

  const handleUpdateCard = (card: Card) => {
    store.updateCard({
      ...card,
      updatedAt: new Date().toISOString()
    });
    setEditingCard(null);
    setIsCardModalOpen(false);
    toast.success('Card updated successfully!');
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      store.deleteCard(cardId);
      toast.success('Card deleted successfully!');
    }
  };

  const filteredCards = cards.filter(
    (card) => selectedCategory === 'All' || card.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Card Management
        </h2>
        <button
          onClick={() => {
            setEditingCard(null);
            setIsCardModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
        >
          <FaPlus /> Add Card
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-purple-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/60 border border-purple-500/30 rounded-lg p-2 text-white"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <AnimatePresence>
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group relative bg-black/60 rounded-xl border border-purple-500/30 overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              {/* Card Image */}
              <div className="relative aspect-[3/4] w-full bg-black/40">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/path/to/default/card-image.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
                
                {/* Card Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {card.name}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{card.description}</p>
                  
                  {/* Card Stats */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {card.stats && (
                      <>
                        <div className="text-purple-400">ATK: {card.stats.attack}</div>
                        <div className="text-blue-400">DEF: {card.stats.defense}</div>
                        <div className="text-green-400">HP: {card.stats.health}</div>
                        <div className="text-yellow-400">EN: {card.stats.energy}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingCard(card);
                      setIsCardModalOpen(true);
                    }}
                    className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600/80 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600/80 transition-colors"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      store.updateCard({
                        ...card,
                        isStarter: !card.isStarter,
                        updatedAt: new Date().toISOString()
                      });
                      toast.success(`Card ${card.isStarter ? 'removed from' : 'set as'} starter`);
                    }}
                    className={`p-2 ${
                      card.isStarter ? 'bg-yellow-500/80' : 'bg-gray-500/80'
                    } text-white rounded-lg hover:bg-yellow-600/80 transition-colors`}
                  >
                    <FaStar />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Card Creation/Edit Modal */}
      <CardCreationModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCard(null);
        }}
        onSave={editingCard ? handleUpdateCard : handleAddCard}
        card={editingCard}
        categories={categories}
        classes={classes}
      />
    </div>
  );
};

export default CardManagement;
