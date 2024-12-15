import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { FaUserCircle, FaHeart, FaBolt, FaShieldAlt } from 'react-icons/fa';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { player } = usePlayer();

  // Redirect if no player is logged in
  React.useEffect(() => {
    if (!player) {
      navigate('/');
    }
  }, [player, navigate]);

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/40 border-b border-pink-500/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <FaUserCircle className="text-4xl text-pink-500" />
              <div>
                <h1 className="text-xl font-bold">{player.username}</h1>
                <p className="text-sm text-gray-400">Level 1</p>
              </div>
            </div>
            
            {/* Player Stats */}
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <FaHeart className="text-red-500" />
                <span>100</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaBolt className="text-yellow-500" />
                <span>100</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-blue-500" />
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Player Deck */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-pink-500/20">
            <h2 className="text-xl font-bold mb-4">Your Deck</h2>
            <div className="grid grid-cols-2 gap-4">
              {player.cards?.map((card: any) => (
                <div 
                  key={card.id}
                  className="bg-gray-800/60 rounded-xl p-4 border border-pink-500/10"
                >
                  <img src={card.imageUrl} alt={card.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <h3 className="font-semibold">{card.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Game Area */}
          <div className="md:col-span-2 bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-pink-500/20">
            <h2 className="text-xl font-bold mb-4">Game Area</h2>
            <div className="aspect-video bg-gray-800/60 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Select a card to play</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
