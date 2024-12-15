import React, { useState, useEffect, useMemo } from 'react';
import { Card, Move, CardRank } from '../../types/card';
import { useGameStore } from '../../store/gameStore';
import { FaPlus, FaTrash, FaEdit, FaChartBar, FaStar, FaBalanceScale, FaCheck, FaGlobeAmericas } from 'react-icons/fa';
import { GlobalMoveSelector } from './GlobalMoveSelector';
import { useValidation } from '../../hooks/useValidation';

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, card: Card) => void;
  editingCard?: Card | null;
}

const CardCreationModal: React.FC<CardCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard
}) => {
  const gameStore = useGameStore();
  const { classes = [], categories = [] } = gameStore;
  const { validate } = useValidation();

  const [cardData, setCardData] = useState<Card>({
    id: '',
    name: '',
    description: '',
    class: '',
    category: '',
    rank: 'COMMON',
    imageUrl: '',
    starLevel: 1,
    stats: {
      attack: 10,
      defense: 10,
      health: 100,
      energy: 100
    }
  });

  const [selectedMove, setSelectedMove] = useState<Move>({
    id: '',
    name: '',
    description: '',
    power: 0,
    energyCost: 0,
    type: 'physical',
    category: 'attack',
    targetType: 'single',
    cooldown: 0,
    classes: []
  });

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'details' | 'moves' | 'stats'>('details');

  const [isBalanced, setIsBalanced] = useState({
    attack: false,
    defense: false,
    speed: false,
    energy: false
  });

  const [isGlobalMoveSelectorOpen, setIsGlobalMoveSelectorOpen] = useState(false);

  useEffect(() => {
    if (editingCard) {
      // Ensure skills array exists when setting editingCard data
      setCardData({
        ...editingCard,
        skills: editingCard.skills || []
      });
    }
  }, [editingCard]);

  useEffect(() => {
    if (editingCard) {
      setCardData({
        ...cardData,
        ...editingCard,
        stats: {
          ...cardData.stats,
          ...(editingCard.stats || {})
        }
      });
    }
  }, [editingCard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('stats.')) {
      const statName = name.split('.')[1];
      setCardData({
        ...cardData,
        stats: {
          ...cardData.stats,
          [statName]: Number(value)
        }
      });
    } else if (name === 'category') {
      // Find the category by name to get its ID
      const selectedCategory = categories.find(cat => cat.name === value);
      setCardData({
        ...cardData,
        category: value,
        categoryId: selectedCategory?.id || ''
      });
    } else {
      setCardData({
        ...cardData,
        [name]: value
      });
    }
  };

  const handleMoveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedMove(prev => ({
      ...prev,
      [name]: name === 'power' || name === 'energyCost' ? Number(value) : value
    }));
  };

  const addMove = () => {
    if (selectedMove.name && selectedMove.description) {
      // Create a new move with a unique ID
      const newMove: Move = {
        ...selectedMove,
        id: crypto.randomUUID(),
        classes: cardData.class ? [cardData.class] : []
      };

      // Add to card's skills
      const updatedSkills = [...(cardData.skills || []), newMove];
      setCardData(prev => ({
        ...prev,
        skills: updatedSkills
      }));

      // Check if the move already exists in the global moves
      const existingMove = gameStore.moves?.find(m => 
        m.name === newMove.name && m.description === newMove.description
      );

      // Add to global moves if it doesn't exist
      if (!existingMove) {
        gameStore.addMove({
          ...newMove,
          createdAt: new Date().toISOString()
        });
      }

      // Reset selected move
      setSelectedMove({
        id: '',
        name: '',
        description: '',
        power: 0,
        energyCost: 0,
        type: 'physical',
        category: 'attack',
        targetType: 'single',
        cooldown: 0,
        classes: []
      });
    }
  };

  const removeMove = (moveId: string) => {
    setCardData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(move => move.id !== moveId)
    }));
  };

  const handleSelectGlobalMove = (move: Move) => {
    // Add the selected global move to the current card's skills
    setCardData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { 
        ...move, 
        id: crypto.randomUUID() 
      }]
    }));

    // Close the global move selector
    setIsGlobalMoveSelectorOpen(false);
  };

  const handleSave = () => {
    const { isValid, validatedData } = validate.card(cardData);
    
    if (isValid && validatedData) {
      // Prepare data for saving
      const preparedCardData: Card = {
        ...validatedData,
        id: editingCard?.id || crypto.randomUUID()
      };

      // Call onSave with the validated and prepared card data
      onSave(preparedCardData.id, preparedCardData);
      onClose(); // Optional: close modal after successful save
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl border border-pink-500/30 animate-fade-in-down relative flex">
          {/* Neon Glow Border */}
          <div className="absolute inset-[-2px] bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-[calc(0.75rem+2px)] opacity-50 blur-lg z-[-1]"></div>
          
          {/* Image Column */}
          <div className="w-1/3 p-6 flex flex-col items-center justify-center relative">
            {cardData.imageUrl ? (
              <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden border-2 border-pink-500/30 shadow-2xl">
                <img 
                  src={cardData.imageUrl} 
                  alt="Card Portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="mt-4 w-full">
              <input
                type="text"
                name="imageUrl"
                value={cardData.imageUrl}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-[2px] bg-gradient-to-b from-transparent via-pink-500/50 to-transparent my-6"></div>
          
          {/* Form Column */}
          <div className="w-2/3 p-6 flex flex-col">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {editingCard ? 'Edit Card' : 'Create New Card'}
              </h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-pink-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-4 space-x-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'details' 
                    ? 'bg-pink-500/30 text-white' 
                    : 'text-gray-400 hover:bg-pink-500/10'
                }`}
              >
                <FaEdit className="mr-2" /> Details
              </button>
              <button
                onClick={() => setActiveTab('moves')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'moves' 
                    ? 'bg-pink-500/30 text-white' 
                    : 'text-gray-400 hover:bg-pink-500/10'
                }`}
              >
                <FaStar className="mr-2" /> Moves
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'stats' 
                    ? 'bg-pink-500/30 text-white' 
                    : 'text-gray-400 hover:bg-pink-500/10'
                }`}
              >
                <FaChartBar className="mr-2" /> Stats
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-grow overflow-hidden">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={handleChange}
                      placeholder="Card name"
                      className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                    <select
                      name="category"
                      value={cardData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name} {cat.description ? `- ${cat.description}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent my-4"></div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center">
                      <FaBalanceScale className="mr-2 text-pink-500" /> 
                      Balance Card Attributes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(isBalanced).map((attr) => (
                        <label 
                          key={attr} 
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isBalanced[attr as keyof typeof isBalanced]}
                            onChange={() => setIsBalanced(prev => ({
                              ...prev, 
                              [attr]: !prev[attr as keyof typeof isBalanced]
                            }))}
                            className="hidden"
                          />
                          <span 
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                              isBalanced[attr as keyof typeof isBalanced] 
                                ? 'bg-pink-500 border-pink-500' 
                                : 'border-gray-600 bg-transparent'
                            }`}
                          >
                            {isBalanced[attr as keyof typeof isBalanced] && <FaCheck className="text-white text-xs" />}
                          </span>
                          <span className="text-xs text-gray-300 capitalize">{attr}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Checking these will help balance the card with other cards in the game.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Class</label>
                      <select
                        name="class"
                        value={cardData.class}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Star Rank</label>
                      <select
                        name="starLevel"
                        value={cardData.starLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                      >
                        {[1, 2, 3, 4, 5].map(rank => (
                          <option key={rank} value={rank}>{rank} Star</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={cardData.description}
                      onChange={handleChange}
                      placeholder="Card description"
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'moves' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-300">Moves</h3>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={addMove}
                        className="text-pink-500 hover:text-pink-400 text-sm flex items-center"
                      >
                        <FaPlus className="mr-1" /> Add Move
                      </button>
                      <button 
                        onClick={() => setIsGlobalMoveSelectorOpen(true)}
                        className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                        title="Select from Global Move Library"
                      >
                        <FaGlobeAmericas className="mr-1" /> Global Moves
                      </button>
                    </div>
                  </div>
                  
                  {/* Moves List */}
                  <div className="space-y-2">
                    {(cardData.skills || []).map((move) => (
                      <div 
                        key={move.id} 
                        className="bg-gray-800/60 rounded-lg p-3 flex justify-between items-center border border-pink-500/20 hover:border-pink-500/50 transition-all"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs text-white font-medium">{move.name}</p>
                            {move.createdAt && (
                              <span 
                                className="text-[10px] text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded-full"
                                title={`Created on ${new Date(move.createdAt).toLocaleDateString()}`}
                              >
                                Global
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{move.description}</p>
                          <div className="mt-1 flex space-x-2">
                            <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">
                              {move.type}
                            </span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                              {move.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              // Edit move 
                              setSelectedMove(move);
                            }}
                            className="text-blue-500 hover:text-blue-400"
                            title="Edit Move"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => removeMove(move.id)}
                            className="text-red-500 hover:text-red-400"
                            title="Remove Move"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Move Input Form */}
                  <div className="mt-4 bg-gray-800/60 p-4 rounded-lg border border-pink-500/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Move Name</label>
                        <input
                          type="text"
                          name="name"
                          value={selectedMove.name}
                          onChange={handleMoveChange}
                          placeholder="Enter move name"
                          className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                        <input
                          type="text"
                          name="description"
                          value={selectedMove.description}
                          onChange={handleMoveChange}
                          placeholder="Describe the move"
                          className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Power</label>
                        <input
                          type="number"
                          name="power"
                          value={selectedMove.power}
                          onChange={handleMoveChange}
                          placeholder="Move power"
                          className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Energy Cost</label>
                        <input
                          type="number"
                          name="energyCost"
                          value={selectedMove.energyCost}
                          onChange={handleMoveChange}
                          placeholder="Energy required"
                          className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Type</label>
                        <select
                          name="type"
                          value={selectedMove.type}
                          onChange={handleMoveChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white"
                        >
                          <option value="physical">Physical</option>
                          <option value="magical">Magical</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                        <select
                          name="category"
                          value={selectedMove.category}
                          onChange={handleMoveChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white"
                        >
                          <option value="attack">Attack</option>
                          <option value="defense">Defense</option>
                          <option value="support">Support</option>
                          <option value="ultimate">Ultimate</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(cardData.stats || {}).map(([statName, statValue]) => (
                    <div key={statName} className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                        {statName.replace('_', ' ')}
                      </label>
                      <input
                        type="number"
                        name={`stats.${statName}`}
                        value={statValue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800/60 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-4">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                {editingCard ? 'Update Card' : 'Create Card'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <GlobalMoveSelector 
        isOpen={isGlobalMoveSelectorOpen}
        onClose={() => setIsGlobalMoveSelectorOpen(false)}
        onSelectMove={handleSelectGlobalMove}
        currentCardClass={cardData.class}
      />
    </>
  );
};

export default CardCreationModal;
