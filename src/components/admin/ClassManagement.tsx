import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';

export const ClassManagement: React.FC = () => {
  const { classes = [], moves = [], addClass, updateClass, deleteClass } = useGameStore();
  const [newClass, setNewClass] = useState({ 
    id: '',
    name: '', 
    description: '', 
    abilities: [], 
    moves: [],
    starLevel: 1
  });
  const [editingClass, setEditingClass] = useState<any>(null);

  const handleAddClass = () => {
    addClass({
      ...newClass,
      id: crypto.randomUUID()
    });
    setNewClass({ id: '', name: '', description: '', abilities: [], moves: [], starLevel: 1 });
  };

  const handleUpdateClass = (id: string, updatedClass: any) => {
    updateClass(id, updatedClass);
    setEditingClass(null);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteClass(id);
    }
  };

  const StarLevelSelector = ({ value, onChange }: { value: number; onChange: (level: number) => void }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={`focus:outline-none transition-colors ${
            level <= value ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          <FaStar size={20} />
        </button>
      ))}
    </div>
  );

  const renderClassForm = (cls: any, isNew: boolean = false) => (
    <div className="space-y-4">
      <div>
        <label htmlFor="className" className="block text-sm font-medium text-gray-400 mb-1">
          Class Name
        </label>
        <input
          id="className"
          type="text"
          value={cls.name}
          onChange={(e) =>
            isNew
              ? setNewClass({ ...newClass, name: e.target.value })
              : setEditingClass({ ...editingClass, name: e.target.value })
          }
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Star Level
        </label>
        <StarLevelSelector
          value={cls.starLevel || 1}
          onChange={(level) =>
            isNew
              ? setNewClass({ ...newClass, starLevel: level })
              : setEditingClass({ ...editingClass, starLevel: level })
          }
        />
      </div>

      <div>
        <label htmlFor="classDescription" className="block text-sm font-medium text-gray-400 mb-1">
          Description
        </label>
        <textarea
          id="classDescription"
          value={cls.description}
          onChange={(e) =>
            isNew
              ? setNewClass({ ...newClass, description: e.target.value })
              : setEditingClass({ ...editingClass, description: e.target.value })
          }
          className="w-full p-2 bg-gray-700 rounded text-white h-24"
        />
      </div>
      <div>
        <label htmlFor="classAbilities" className="block text-sm font-medium text-gray-400 mb-1">
          Abilities (comma-separated)
        </label>
        <input
          id="classAbilities"
          type="text"
          value={cls.abilities.join(', ')}
          onChange={(e) => {
            const abilities = e.target.value.split(',').map((a) => a.trim());
            isNew
              ? setNewClass({ ...newClass, abilities })
              : setEditingClass({ ...editingClass, abilities });
          }}
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
      </div>
      <div>
        <label htmlFor="classMoves" className="block text-sm font-medium text-gray-400 mb-1">
          Moves
        </label>
        <select
          id="classMoves"
          multiple
          value={cls.moves || []}
          onChange={(e) => {
            const selectedMoves = Array.from(e.target.selectedOptions, (option) => option.value);
            isNew
              ? setNewClass({ ...newClass, moves: selectedMoves })
              : setEditingClass({ ...editingClass, moves: selectedMoves });
          }}
          className="w-full p-2 bg-gray-700 rounded text-white"
        >
          {(moves || []).map((move) => (
            <option key={move.id} value={move.name}>
              {move.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() =>
          isNew ? handleAddClass() : handleUpdateClass(editingClass.id, editingClass)
        }
        className="w-full p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
      >
        {isNew ? 'Add Class' : 'Update Class'}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Class Management</h2>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 space-y-4 min-w-[300px]">{renderClassForm(newClass, true)}</div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(classes || []).map((cls) => (
          <div key={cls.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
            <p className="text-gray-400 mb-4">{cls.description}</p>
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Abilities:</h4>
              <ul className="list-disc list-inside">
                {(cls.abilities || []).map((ability, index) => (
                  <li key={index}>{ability}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Moves:</h4>
              <ul className="list-disc list-inside">
                {(cls.moves || []).map((move, index) => (
                  <li key={index}>{move}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Star Level:</h4>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <FaStar
                    key={level}
                    size={20}
                    className={`text-${level <= cls.starLevel ? 'yellow' : 'gray'}-400`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setEditingClass(cls)}
                className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaEdit className="mr-2" /> Edit Class
              </button>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="w-full p-2 bg-red-600 rounded hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <FaTrash className="mr-2" /> Delete Class
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Class: {editingClass.name}</h3>
            {renderClassForm(editingClass)}
            <button
              onClick={() => setEditingClass(null)}
              className="mt-4 w-full p-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
