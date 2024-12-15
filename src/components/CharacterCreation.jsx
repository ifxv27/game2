import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { useCards } from '../hooks/useCards';
import { 
  FaStar, 
  FaCheck, 
  FaShieldAlt 
} from 'react-icons/fa';
import { GiCrossedSwords } from 'react-icons/gi';

const CharacterCreation = () => {
  const navigate = useNavigate();
  const { currentPlayer, updatePlayer, setStarterCardSelected } = usePlayerStore();
  const { cards } = useCards();
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [characterName, setCharacterName] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [starterCards, setStarterCards] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    // Redirect if not logged in or already has starter card
    if (!currentPlayer) {
      navigate('/');
      return;
    }
    if (currentPlayer.hasStarterCard) {
      navigate('/game');
      return;
    }
  }, [currentPlayer, navigate]);

  useEffect(() => {
    const loadStarterCards = async () => {
      setIsLoadingCards(true);
      try {
        const starterCards = cards.filter(card => card.category === 'Starter');
        setStarterCards(starterCards);
      } catch (error) {
        console.error('Error loading starter cards:', error);
      }
      setIsLoadingCards(false);
    };

    loadStarterCards();
  }, [cards]);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleCharacterCreate = async () => {
    if (!selectedCard || !characterName.trim()) {
      return;
    }

    try {
      // Update player profile with starter card and character name
      const updatedProfile = {
        ...currentPlayer,
        name: characterName,
        starterCard: selectedCard,
        hasStarterCard: true,
        stats: {
          health: 100,
          attack: selectedCard.attack || 10,
          defense: selectedCard.defense || 5,
          energy: 100
        }
      };

      await updatePlayer(updatedProfile);
      setStarterCardSelected(true);
      
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/game');
      }, 1000);
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/30 to-pink-900/30 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Starter Card</h1>
        
        {isLoadingCards ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starterCards.map((card) => (
              <div
                key={card.id}
                className={`bg-gray-800/50 rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedCard?.id === card.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => handleCardSelect(card)}
              >
                <div className="relative">
                  <div className="w-full h-48 bg-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FaStar className="w-16 h-16 text-yellow-300" />
                    )}
                  </div>
                  {selectedCard?.id === card.id && (
                    <div className="absolute top-2 right-2">
                      <FaCheck className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                <p className="text-gray-400 mb-4">{card.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <GiCrossedSwords className="text-orange-500" />
                    <span>{card.attack || 10}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-blue-500" />
                    <span>{card.defense || 5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCard && (
          <div className="mt-8">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Create Your Character</h2>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Character Name</label>
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="w-full bg-gray-700/50 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your character's name"
                  />
                </div>
                <button
                  onClick={handleCharacterCreate}
                  disabled={!characterName.trim()}
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                    characterName.trim()
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <span>Create Character</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-xl">Creating your character...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCreation;
