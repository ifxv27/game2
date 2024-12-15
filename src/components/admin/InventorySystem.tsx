import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export const InventorySystem: React.FC = () => {
  const { players = [], addInventoryItem, updateInventoryItem, deleteInventoryItem } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 1 });
  const [editingItem, setEditingItem] = useState<(InventoryItem & { index: number }) | null>(null);

  const handleAddItem = () => {
    if (selectedPlayer && newItem.name) {
      addInventoryItem(selectedPlayer, newItem);
      setNewItem({ name: '', quantity: 1 });
    }
  };

  const handleUpdateItem = (itemId: string, updatedItem: Omit<InventoryItem, 'id'>) => {
    if (selectedPlayer) {
      updateInventoryItem(selectedPlayer, itemId, updatedItem);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (selectedPlayer) {
      deleteInventoryItem(selectedPlayer, itemId);
    }
  };

  const selectedPlayerData = selectedPlayer ? players.find((p) => p.id === selectedPlayer) : null;

  return (
    <div className="space-y-6 p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Inventory System</h2>

      <div>
        <label htmlFor="playerSelect" className="block text-sm font-medium text-gray-400 mb-1">
          Select Player
        </label>
        <select
          id="playerSelect"
          value={selectedPlayer || ''}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
        >
          <option value="">Select a player</option>
          {players?.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPlayerData && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Player Inventory</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item name"
                className="flex-1 p-2 bg-gray-700 rounded text-white"
              />
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                min="1"
                className="w-24 p-2 bg-gray-700 rounded text-white"
              />
              <button
                onClick={handleAddItem}
                disabled={!newItem.name}
                className="p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
            {selectedPlayerData.inventory?.map((item: InventoryItem, index) => (
              <div key={item.id} className="flex items-center gap-4 bg-gray-800 p-2 rounded">
                <span className="flex-1">{item.name}</span>
                <span>Quantity: {item.quantity}</span>
                <button
                  onClick={() => setEditingItem({ ...item, index })}
                  className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Edit Item</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
              <input
                type="number"
                value={editingItem.quantity}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })
                }
                min="1"
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
              <button
                onClick={() =>
                  handleUpdateItem(editingItem.id, {
                    name: editingItem.name,
                    quantity: editingItem.quantity,
                  })
                }
                disabled={!editingItem.name}
                className="w-full p-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Item
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="w-full p-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySystem;
