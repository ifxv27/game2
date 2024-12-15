import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaPlus, FaTrash, FaEdit, FaLink } from 'react-icons/fa';
import { Move } from '../../types/card';
import { motion, AnimatePresence } from 'framer-motion';

export const MovesAndSkillsManagement: React.FC = () => {
  const store = useGameStore();
  const moves = useGameStore((state) => state.moves || []);
  const classes = useGameStore((state) => state.classes || []);
  const cards = useGameStore((state) => state.cards || []);

  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');

  useEffect(() => {
    store.initializeStore?.();
  }, []);

  const handleEditMove = (move: Move) => {
    const initializedMove: Move = {
      id: move.id,
      name: move.name || '',
      description: move.description || '',
      power: Number(move.power) || 0,
      energyCost: Number(move.energyCost) || 0,
      type: move.type || 'physical',
      category: move.category || 'attack',
      targetType: move.targetType || 'single',
      cooldown: Number(move.cooldown) || 0,
      classes: Array.isArray(move.classes) ? [...move.classes] : [],
      effectChance: move.effectChance,
      statusEffect: move.statusEffect
    };
    setIsEditing(true);
    setCurrentMove(initializedMove);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMove) return;

    if (isEditing) {
      store.updateMove(currentMove.id, currentMove);
    } else {
      store.addMove({
        ...currentMove,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      });
    }

    setCurrentMove(null);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this move?')) {
      store.deleteMove(id);
    }
  };

  const filteredMoves = moves.filter(move => 
    (!selectedClass || move.classes.includes(selectedClass))
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          Moves & Skills Management
        </h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-black/60 border border-purple-500/30 rounded-lg p-2 text-white"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>

          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="bg-black/60 border border-purple-500/30 rounded-lg p-2 text-white"
          >
            <option value="">Select Card to Link Move</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>{card.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Moves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMoves.map((move) => (
          <motion.div
            key={move.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/60 rounded-xl border border-purple-500/30 p-4 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {move.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditMove(move)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(move.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaTrash />
                </button>
                {selectedCard && (
                  <button
                    onClick={() => {
                      // Logic to link move to selected card
                      const card = cards.find(c => c.id === selectedCard);
                      if (card) {
                        store.updateCard({
                          ...card,
                          moves: [...(card.moves || []), move.id]
                        });
                      }
                    }}
                    className="text-green-400 hover:text-green-300 transition-colors"
                    title="Link to selected card"
                  >
                    <FaLink />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-2">{move.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-purple-400">Power: {move.power}</div>
              <div className="text-blue-400">Energy: {move.energyCost}</div>
              <div className="text-pink-400">Type: {move.type}</div>
              <div className="text-orange-400">CD: {move.cooldown}s</div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {move.classes.map((classId) => {
                const classObj = classes.find(c => c.id === classId);
                return (
                  <span
                    key={classId}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300"
                  >
                    {classObj?.name || classId}
                  </span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Move Form Modal */}
      <AnimatePresence>
        {currentMove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => {
              setCurrentMove(null);
              setIsEditing(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/60 rounded-xl border border-purple-500/30 p-6 max-w-lg w-full m-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                {isEditing ? 'Edit Move' : 'Add New Move'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields here */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={currentMove?.name || ''}
                      onChange={(e) => setCurrentMove({ ...currentMove, name: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={currentMove?.description || ''}
                      onChange={(e) => setCurrentMove({ ...currentMove, description: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Power</label>
                    <input
                      type="number"
                      name="power"
                      value={currentMove?.power || 0}
                      onChange={(e) => setCurrentMove({ ...currentMove, power: Number(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Energy Cost</label>
                    <input
                      type="number"
                      name="energyCost"
                      value={currentMove?.energyCost || 0}
                      onChange={(e) => setCurrentMove({ ...currentMove, energyCost: Number(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Type</label>
                    <select
                      name="type"
                      value={currentMove?.type || 'physical'}
                      onChange={(e) => setCurrentMove({ ...currentMove, type: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    >
                      <option value="physical">Physical</option>
                      <option value="magical">Magical</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                      name="category"
                      value={currentMove?.category || 'attack'}
                      onChange={(e) => setCurrentMove({ ...currentMove, category: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    >
                      <option value="attack">Attack</option>
                      <option value="defense">Defense</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Target Type</label>
                    <select
                      name="targetType"
                      value={currentMove?.targetType || 'single'}
                      onChange={(e) => setCurrentMove({ ...currentMove, targetType: e.target.value })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    >
                      <option value="single">Single</option>
                      <option value="all">All</option>
                      <option value="self">Self</option>
                      <option value="allies">Allies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Cooldown</label>
                    <input
                      type="number"
                      name="cooldown"
                      value={currentMove?.cooldown || 0}
                      onChange={(e) => setCurrentMove({ ...currentMove, cooldown: Number(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Classes</label>
                    <select
                      name="classes"
                      multiple
                      value={currentMove?.classes || []}
                      onChange={(e) => setCurrentMove({ ...currentMove, classes: Array.from(e.target.selectedOptions, option => option.value) })}
                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white min-h-[100px]"
                    >
                      {(classes || []).map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple classes</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  {isEditing ? 'Update Move' : 'Add Move'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Move Button */}
      <button
        onClick={() => {
          setCurrentMove({
            id: '',
            name: '',
            description: '',
            power: 0,
            energyCost: 0,
            type: 'physical',
            category: 'attack',
            targetType: 'single',
            cooldown: 0,
            classes: [],
          });
          setIsEditing(false);
        }}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default MovesAndSkillsManagement;
