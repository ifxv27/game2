import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { useGameStore } from '../../store/gameStore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Tab } from '@headlessui/react';

// Utility function to combine class names
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

interface EditModalProps {
  player: any;
  onClose: () => void;
  onSave: (updatedPlayer: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ player, onClose, onSave }) => {
  const [editedPlayer, setEditedPlayer] = useState({ ...player });
  const { cards, tasks } = useGameStore();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleSave = () => {
    onSave(editedPlayer);
  };

  const tabNames = ['Basic Info', 'Inventory', 'Tasks'];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Edit Player: {player.username}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 rounded-xl bg-gray-800 p-1 mb-6">
            {tabNames.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-500',
                    selected
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="space-y-4">
              {/* Basic Info Tab */}
              <div>
                <label className="text-gray-300 block mb-1">Username</label>
                <input
                  type="text"
                  value={editedPlayer.username}
                  onChange={(e) => setEditedPlayer(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  onChange={(e) => setEditedPlayer(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Role</label>
                <select
                  value={editedPlayer.role}
                  onChange={(e) => setEditedPlayer(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                >
                  <option value="player">Player</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Level</label>
                <input
                  type="number"
                  value={editedPlayer.level}
                  onChange={(e) => setEditedPlayer(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Money</label>
                <input
                  type="number"
                  value={editedPlayer.money}
                  onChange={(e) => setEditedPlayer(prev => ({ ...prev, money: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </Tab.Panel>

            <Tab.Panel>
              {/* Inventory Tab */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-400">Card Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-300 mb-3">Available Cards</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {cards.map((card) => (
                        <div key={card.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span className="text-gray-300">{card.name}</span>
                          <button
                            onClick={() => {
                              setEditedPlayer(prev => ({
                                ...prev,
                                inventory: [...(prev.inventory || []), card]
                              }))
                            }}
                            className="text-green-500 hover:text-green-400"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-300 mb-3">Player's Cards</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {editedPlayer.inventory?.map((card: any) => (
                        <div key={card.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span className="text-gray-300">{card.name}</span>
                          <button
                            onClick={() => {
                              setEditedPlayer(prev => ({
                                ...prev,
                                inventory: prev.inventory.filter((c: any) => c.id !== card.id)
                              }))
                            }}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              {/* Tasks Tab */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-400">Player Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-300 mb-3">Available Tasks</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span className="text-gray-300">{task.name}</span>
                          <button
                            onClick={() => {
                              setEditedPlayer(prev => ({
                                ...prev,
                                tasks: [...(prev.tasks || []), task]
                              }))
                            }}
                            className="text-green-500 hover:text-green-400"
                          >
                            Assign
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-300 mb-3">Assigned Tasks</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {editedPlayer.tasks?.map((task: any) => (
                        <div key={task.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span className="text-gray-300">{task.name}</span>
                          <button
                            onClick={() => {
                              setEditedPlayer(prev => ({
                                ...prev,
                                tasks: prev.tasks.filter((t: any) => t.id !== task.id)
                              }))
                            }}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const { players, updatePlayer, deletePlayer } = usePlayerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<any>(null);

  const filteredPlayers = players.filter((player) =>
    player.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.character?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player);
  };

  const handleSavePlayer = (updatedPlayer: any) => {
    updatePlayer(updatedPlayer);
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      deletePlayer(playerId);
    }
  };

  const getPlayerImageUrl = (player: any) => {
    // Robust image URL retrieval strategy
    return (
      player.imageUrl || 
      player.character?.imageUrl || 
      player.activeCard?.imageUrl || 
      player.selectedCard?.imageUrl || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(player.username || 'Player')}&background=random`
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Player Management
        </h1>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Players List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="group relative bg-black/60 rounded-xl border border-purple-500/30 overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            {/* Character Image Container */}
            <div className="relative aspect-square w-full bg-black/40">
              <img
                src={getPlayerImageUrl(player)}
                alt={player.character?.name || player.username || 'Character'}
                className="absolute inset-0 w-full h-full object-contain"
                onLoad={(e) => {
                  console.log('Image loaded successfully:', {
                    src: (e.target as HTMLImageElement).src,
                    characterImageUrl: player.character?.imageUrl,
                    activeCardImageUrl: player.activeCard?.imageUrl,
                    selectedCardImageUrl: player.selectedCard?.imageUrl,
                    fullPlayer: player
                  });
                }}
                onError={(e) => {
                  console.error('Image failed to load:', {
                    src: (e.target as HTMLImageElement).src,
                    characterImageUrl: player.character?.imageUrl,
                    activeCardImageUrl: player.activeCard?.imageUrl,
                    selectedCardImageUrl: player.selectedCard?.imageUrl,
                    fullPlayer: player
                  });
                  (e.target as HTMLImageElement).src = '/path/to/default/image.png'; // Add a default image path
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />

              {/* Player Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent">
                <div className="p-3 space-y-0.5">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {player.username || 'Unnamed Player'}
                  </h3>
                  {player.character && (
                    <div className="text-gray-300 text-sm">
                      {player.character.name}
                    </div>
                  )}
                  <div className="text-gray-400 text-sm">
                    Level {player.stats?.level || 1} • {player.stats?.coins || 0} Money
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 bg-black/40">
              <div className="pt-2 border-t border-purple-500/20">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEditPlayer(player)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-900/20"
                    title="Edit Player"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-900/20"
                    title="Delete Player"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPlayer && (
        <EditModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={handleSavePlayer}
        />
      )}
    </div>
  );
};

export default Settings;
