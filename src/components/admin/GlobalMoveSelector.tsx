import React, { useState, useMemo } from 'react';
import { Move } from '../../types/card';
import { useGameStore } from '../../store/gameStore';
import { FaPlus, FaSearch, FaFilter, FaGlobeAmericas } from 'react-icons/fa';

interface GlobalMoveSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMove: (move: Move) => void;
  currentCardClass?: string;
}

export const GlobalMoveSelector: React.FC<GlobalMoveSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMove,
  currentCardClass 
}) => {
  const gameStore = useGameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredMoves = useMemo(() => {
    if (!isOpen) return [];

    // Ensure moves is an array
    const movesToFilter = gameStore.moves || [];

    return movesToFilter.filter(move => {
      const matchesSearch = !searchTerm || 
        move.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        move.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || move.type === selectedType;
      
      const matchesCategory = !selectedCategory || move.category === selectedCategory;
      
      const matchesClass = !currentCardClass || 
        !move.classes?.length || 
        move.classes.includes(currentCardClass);

      return matchesSearch && matchesType && matchesCategory && matchesClass;
    });
  }, [
    gameStore.moves, 
    searchTerm, 
    selectedType, 
    selectedCategory, 
    currentCardClass, 
    isOpen
  ]);

  const handleSelectMove = (move: Move) => {
    onSelectMove(move);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-[800px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-pink-500/20">
          <div className="flex items-center space-x-2">
            <FaGlobeAmericas className="text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Global Move Library</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 grid grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search moves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 rounded-lg border border-pink-500/20 text-white"
            />
          </div>
          
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-pink-500/20 text-white"
          >
            <option value="">All Types</option>
            <option value="physical">Physical</option>
            <option value="magical">Magical</option>
            <option value="status">Status</option>
          </select>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-lg border border-pink-500/20 text-white"
          >
            <option value="">All Categories</option>
            <option value="attack">Attack</option>
            <option value="defense">Defense</option>
            <option value="support">Support</option>
            <option value="ultimate">Ultimate</option>
          </select>
        </div>

        {/* Moves List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {filteredMoves.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No moves found matching your filters.</p>
              {currentCardClass && (
                <p className="text-xs mt-2">
                  Try removing the class filter or broadening your search.
                </p>
              )}
            </div>
          ) : (
            filteredMoves.map((move) => (
              <div 
                key={move.id} 
                className="bg-gray-800/60 rounded-lg p-3 flex justify-between items-center border border-pink-500/20 hover:border-pink-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-white font-medium">{move.name}</p>
                    {move.classes && move.classes.length > 0 && (
                      <span 
                        className="text-[10px] text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded-full"
                        title={`Available for classes: ${move.classes.join(', ')}`}
                      >
                        {move.classes[0]}
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
                <button 
                  onClick={() => handleSelectMove(move)}
                  className="text-pink-500 hover:text-pink-400 flex items-center"
                  title="Add Move to Card"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-pink-500/20 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            {filteredMoves.length} move{filteredMoves.length !== 1 ? 's' : ''} found
          </p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
