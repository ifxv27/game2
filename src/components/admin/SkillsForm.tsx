import React, { useState } from 'react';

interface Move {
  id: string;
  name: string;
  description: string;
  power: number;
  energyCost: number;
  animation: 'attack' | 'defense' | 'special' | 'ultimate';
}

interface SkillsFormProps {
  moves: Move[];
  onSubmit: (moves: Move[]) => void;
  onCancel: () => void;
  maxMoves?: number;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ 
  moves: initialMoves, 
  onSubmit, 
  onCancel, 
  maxMoves = 4 
}) => {
  const [moves, setMoves] = useState<Move[]>(initialMoves);
  const [newMove, setNewMove] = useState<Partial<Move>>({
    name: '',
    description: '',
    power: 0,
    energyCost: 0,
    animation: 'attack'
  });
  const [error, setError] = useState<string>('');

  const validateMove = (move: Partial<Move>): boolean => {
    if (!move.name || move.name.trim() === '') {
      setError('Move name is required');
      return false;
    }
    if (move.power === undefined || move.power < 0) {
      setError('Power must be a positive number');
      return false;
    }
    if (move.energyCost === undefined || move.energyCost < 0) {
      setError('Energy cost must be a positive number');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddMove = () => {
    if (moves.length >= maxMoves) {
      setError(`Maximum ${maxMoves} moves allowed`);
      return;
    }

    if (!validateMove(newMove)) return;

    const move: Move = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMove.name!,
      description: newMove.description || '',
      power: newMove.power!,
      energyCost: newMove.energyCost!,
      animation: newMove.animation || 'attack'
    };

    setMoves(prev => [...prev, move]);
    setNewMove({
      name: '',
      description: '',
      power: 0,
      energyCost: 0,
      animation: 'attack'
    });
  };

  const handleRemoveMove = (moveId: string) => {
    setMoves(prev => prev.filter(move => move.id !== moveId));
  };

  const handleUpdateMove = (moveId: string, field: keyof Move, value: string | number) => {
    setMoves(prev => prev.map(move => {
      if (move.id === moveId) {
        return { ...move, [field]: value };
      }
      return move;
    }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Edit Moves</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {/* Current Moves */}
      <div className="space-y-4 mb-6">
        {moves.map(move => (
          <div key={move.id} className="bg-gray-700 p-4 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={move.name}
                onChange={(e) => handleUpdateMove(move.id, 'name', e.target.value)}
                className="bg-gray-600 text-white px-2 py-1 rounded"
                placeholder="Move name"
              />
              <button
                onClick={() => handleRemoveMove(move.id)}
                className="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={move.description}
              onChange={(e) => handleUpdateMove(move.id, 'description', e.target.value)}
              className="bg-gray-600 text-white px-2 py-1 rounded w-full"
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={move.power}
                onChange={(e) => handleUpdateMove(move.id, 'power', parseInt(e.target.value))}
                className="bg-gray-600 text-white px-2 py-1 rounded"
                placeholder="Power"
              />
              <input
                type="number"
                value={move.energyCost}
                onChange={(e) => handleUpdateMove(move.id, 'energyCost', parseInt(e.target.value))}
                className="bg-gray-600 text-white px-2 py-1 rounded"
                placeholder="Energy Cost"
              />
            </div>
            <select
              value={move.animation}
              onChange={(e) => handleUpdateMove(move.id, 'animation', e.target.value as Move['animation'])}
              className="bg-gray-600 text-white px-2 py-1 rounded"
            >
              <option value="attack">Attack</option>
              <option value="defense">Defense</option>
              <option value="special">Special</option>
              <option value="ultimate">Ultimate</option>
            </select>
          </div>
        ))}
      </div>

      {/* Add New Move Form */}
      {moves.length < maxMoves && (
        <div className="bg-gray-700 p-4 rounded-lg space-y-2">
          <input
            type="text"
            value={newMove.name}
            onChange={(e) => setNewMove(prev => ({ ...prev, name: e.target.value }))}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full"
            placeholder="New move name"
          />
          <input
            type="text"
            value={newMove.description}
            onChange={(e) => setNewMove(prev => ({ ...prev, description: e.target.value }))}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full"
            placeholder="Description"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={newMove.power}
              onChange={(e) => setNewMove(prev => ({ ...prev, power: parseInt(e.target.value) }))}
              className="bg-gray-600 text-white px-2 py-1 rounded"
              placeholder="Power"
            />
            <input
              type="number"
              value={newMove.energyCost}
              onChange={(e) => setNewMove(prev => ({ ...prev, energyCost: parseInt(e.target.value) }))}
              className="bg-gray-600 text-white px-2 py-1 rounded"
              placeholder="Energy Cost"
            />
          </div>
          <select
            value={newMove.animation}
            onChange={(e) => setNewMove(prev => ({ ...prev, animation: e.target.value as Move['animation'] }))}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full"
          >
            <option value="attack">Attack</option>
            <option value="defense">Defense</option>
            <option value="special">Special</option>
            <option value="ultimate">Ultimate</option>
          </select>
          <button
            onClick={handleAddMove}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 w-full"
          >
            Add Move
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(moves)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          Save Moves
        </button>
      </div>
    </div>
  );
};
