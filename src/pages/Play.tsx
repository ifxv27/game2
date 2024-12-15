import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { useBattleStore } from '../store/battleStore';
import { FaPlay, FaUser, FaRobot, FaTrophy, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Play: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'select' | 'battle' | 'stats'>('select');
  const { currentCharacter } = usePlayerStore();
  const { cards } = useGameStore();
  const { startBattle } = useBattleStore();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleCardSelect = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(prev => prev.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards(prev => [...prev, cardId]);
    } else {
      toast.warning('You can only select up to 3 cards');
    }
  };

  const handleStartBattle = (type: 'pvp' | 'pve') => {
    if (selectedCards.length < 3) {
      toast.error('Please select 3 cards to start the battle');
      return;
    }

    if (!currentCharacter) {
      toast.error('Please select a character first');
      return;
    }

    // For PvE, generate AI opponent cards
    const aiCards = cards
      .filter(card => !selectedCards.includes(card.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(card => card.id);

    startBattle(
      type,
      currentCharacter.id,
      type === 'pve' ? 'ai-opponent' : 'player2',
      selectedCards,
      type === 'pve' ? aiCards : []
    );

    setActiveTab('battle');
    toast.success('Battle started!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto bg-black/60 rounded-xl border border-purple-500/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Battle Arena
          </h1>
          <p className="text-gray-400 mt-2">Select your cards and challenge opponents</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-purple-500/30">
          <div className="flex">
            <button
              onClick={() => setActiveTab('select')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'select'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Select Cards
            </button>
            <button
              onClick={() => setActiveTab('battle')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'battle'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Battle
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Stats
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'select' && (
            <div className="space-y-6">
              {/* Selected Cards Preview */}
              <div className="bg-black/40 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Selected Cards ({selectedCards.length}/3)</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((slot) => (
                    <div
                      key={slot}
                      className={`aspect-[3/4] rounded-lg border-2 ${
                        selectedCards[slot]
                          ? 'border-purple-500'
                          : 'border-gray-700 border-dashed'
                      }`}
                    >
                      {selectedCards[slot] && (
                        <div className="relative w-full h-full">
                          <img
                            src={cards.find(c => c.id === selectedCards[slot])?.imageUrl}
                            alt="Selected Card"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-sm font-medium">
                              {cards.find(c => c.id === selectedCards[slot])?.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardSelect(card.id)}
                    className={`group relative bg-black/60 rounded-xl border transition-all duration-300 cursor-pointer ${
                      selectedCards.includes(card.id)
                        ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'border-purple-500/30 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                    }`}
                  >
                    <div className="relative aspect-[3/4] w-full bg-black/40">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-contain rounded-t-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          {card.name}
                        </h3>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div className="text-purple-400">ATK: {card.stats?.attack}</div>
                          <div className="text-blue-400">DEF: {card.stats?.defense}</div>
                          <div className="text-green-400">HP: {card.stats?.health}</div>
                          <div className="text-yellow-400">EN: {card.stats?.energy}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Battle Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleStartBattle('pve')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaRobot /> Battle AI
                </button>
                <button
                  onClick={() => handleStartBattle('pvp')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaUser /> Battle Player
                </button>
              </div>
            </div>
          )}

          {activeTab === 'battle' && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Battle in Progress</h3>
              <p className="text-gray-400">Battle implementation coming soon...</p>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/40 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaTrophy className="text-yellow-400 text-xl" />
                  <h3 className="text-lg font-medium">Win Rate</h3>
                </div>
                <p className="text-3xl font-bold">75%</p>
                <p className="text-sm text-gray-400">Last 20 matches</p>
              </div>
              
              <div className="bg-black/40 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaChartBar className="text-green-400 text-xl" />
                  <h3 className="text-lg font-medium">Total Matches</h3>
                </div>
                <p className="text-3xl font-bold">128</p>
                <p className="text-sm text-gray-400">Since account creation</p>
              </div>

              <div className="bg-black/40 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaPlay className="text-purple-400 text-xl" />
                  <h3 className="text-lg font-medium">Current Streak</h3>
                </div>
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm text-gray-400">Consecutive wins</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Play;
