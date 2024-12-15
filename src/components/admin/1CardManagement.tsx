import React, { useState } from 'react';
import { useCards } from '../../hooks/useCards';
import { Card } from '../../types/card';
import { useGameStore } from '../../store/gameStore';
import { FaPlus, FaEdit, FaTrash, FaStar, FaFilter, FaCog } from 'react-icons/fa';
import styles from '../player/Player.module.css';
import CardCreationModal from './CardCreationModal';
import BulkEditCards from './BulkEditCards';
import { Link } from 'react-router-dom';

const CardManagement: React.FC = () => {
  const { cards, addCard, updateCard, deleteCard } = useCards();
  const gameStore = useGameStore();
  const { categories = [] } = gameStore;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const categoriesList = categories.map((cat) => cat.name);

  const filteredCards = cards.filter(
    (card) => selectedCategory === 'All' || card.category === selectedCategory
  );

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  const handleSave = () => {
    if (!editingCard) return;
    
    const updatedCard = {
      ...editingCard,
      id: editingCard.id || crypto.randomUUID(),
      name: editingCard.name || '',
      description: editingCard.description || '',
      category: editingCard.category || 'Battle',
      imageUrl: editingCard.imageUrl || '',
      stats: editingCard.stats || {}
    };

    if (isEditing) {
      updateCard(updatedCard);
    } else {
      addCard(updatedCard);
    }

    setEditingCard(null);
    setIsEditing(false);
  };

  const handleAddCard = () => {
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-6 bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-pink-500/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Card Management
            </h1>
            <p className="text-gray-400 mt-2">Manage your game's card collection</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddCard}
              className="group relative px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out"
            >
              <span className="absolute inset-0 h-full w-full -translate-x-2 -translate-y-2 transform bg-pink-500 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 h-full w-full border-2 border-pink-500 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></span>
              <span className="relative flex items-center gap-2">
                <FaPlus /> Add New Card
              </span>
            </button>
            <button
              onClick={() => setShowBulkEdit(true)}
              className="group relative px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out"
            >
              <span className="absolute inset-0 h-full w-full -translate-x-2 -translate-y-2 transform bg-purple-500 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 h-full w-full border-2 border-purple-500 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></span>
              <span className="relative flex items-center gap-2">
                <FaEdit /> Bulk Edit
              </span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 p-4 bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-600/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <FaFilter className="text-pink-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-pink-500 border border-gray-600"
              >
                <option value="All">All Categories</option>
                {categoriesList.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 text-right text-gray-400">
              {filteredCards.length} cards found
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredCards.map((card) => (
            <div 
              key={card.id} 
              className="relative group"
            >
              {/* Main Card Container */}
              <div className="relative aspect-[3/4] transform transition-all duration-300 group-hover:scale-[1.02]">
                {/* Background Box Effect */}
                <div className="absolute inset-0 bg-pink-500/10 -translate-x-2 -translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <div className="absolute inset-0 border-2 border-pink-500/20 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                
                {/* Card Content */}
                <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm overflow-hidden">
                  {/* Image Section - Centered */}
                  <div className="relative h-2/3 overflow-hidden">
                    <img 
                      src={card.imageUrl || '/placeholder-card.png'} 
                      alt={card.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  </div>

                  {/* Card Info */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 p-4 flex flex-col justify-between">
                    {/* Title and Stars */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white truncate">{card.name}</h3>
                      <div className="flex gap-0.5">
                        {[...Array(card.starLevel || 1)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" size={16} />
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30 rounded">
                        {card.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30 rounded">
                        {card.class}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-1 mb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">ATK</div>
                        <div className="text-sm font-bold text-white">{card.stats?.attack}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">DEF</div>
                        <div className="text-sm font-bold text-white">{card.stats?.defense}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">HP</div>
                        <div className="text-sm font-bold text-white">{card.stats?.health}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">NRG</div>
                        <div className="text-sm font-bold text-white">{card.stats?.energy}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Appear on Hover */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full max-w-[200px]">
                <button
                  onClick={() => {
                    setEditingCard(card);
                    setIsEditing(true);
                  }}
                  className="group/btn relative flex-1 px-3 py-1.5 font-medium text-white text-sm transition-all duration-300 ease-in-out"
                >
                  <span className="absolute inset-0 h-full w-full -translate-x-1 -translate-y-1 transform bg-blue-500 opacity-20 transition-transform group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"></span>
                  <span className="absolute inset-0 h-full w-full border border-blue-500/50 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5"></span>
                  <span className="relative flex items-center justify-center gap-1">
                    <FaEdit size={12} /> Edit
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="group/btn relative flex-1 px-3 py-1.5 font-medium text-white text-sm transition-all duration-300 ease-in-out"
                >
                  <span className="absolute inset-0 h-full w-full -translate-x-1 -translate-y-1 transform bg-red-500 opacity-20 transition-transform group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"></span>
                  <span className="absolute inset-0 h-full w-full border border-red-500/50 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5"></span>
                  <span className="relative flex items-center justify-center gap-1">
                    <FaTrash size={12} /> Delete
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <CardCreationModal
          isOpen={isCardModalOpen || !!editingCard}
          onClose={() => {
            setIsCardModalOpen(false);
            setEditingCard(null);
          }}
          onSave={handleSave}
          editingCard={editingCard}
        />

        {showBulkEdit && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <BulkEditCards
              onClose={() => setShowBulkEdit(false)}
              onSuccess={() => {
                setShowBulkEdit(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardManagement;
