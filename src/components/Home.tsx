import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { Card, CardRank } from '../types/card';
import styles from './Home.module.css';
import { FaChevronLeft, FaChevronRight, FaHeart, FaBolt, FaShieldAlt, FaDiceD20, FaUser, FaEnvelope, FaLock, FaStar, FaTimes } from 'react-icons/fa';
import { usePlayerStore } from '../store/playerStore';
import { useGameStore } from '../store/gameStore';
import CharacterCreation from './player/CharacterCreation';
import { v4 as uuidv4 } from 'uuid';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { cards } = useCards();
  const { loginPlayer, updatePlayer, currentPlayer } = usePlayerStore();
  const { initializeStore } = useGameStore();
  const [currentTab, setCurrentTab] = useState<'register' | 'login'>('register');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Current Player:', currentPlayer);
    console.log('Cards:', cards);
    
    // Initialize the game store if needed
    initializeStore();
    
    const needsCharacterCreation = !currentPlayer?.hasStarterCard;
    console.log('Needs Character Creation:', needsCharacterCreation);

    if (currentPlayer && !needsCharacterCreation) {
      console.log('Player exists and has character, navigating to game');
      navigate('/game');
    } else {
      console.log('Rendering Character Creation');
    }
  }, [currentPlayer, cards, navigate, initializeStore]);

  // If we need character creation, show that component
  if (!currentPlayer?.hasStarterCard) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <CharacterCreation
            initialPlayerId={null}
            onComplete={() => {
              console.log('Character creation completed');
              navigate('/game');
            }}
          />
        </div>
      </div>
    );
  }

  // If no cards, log and show a message
  if (cards.length === 0) {
    console.error('No cards available for selection');
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-3xl mb-4">No Starter Cards Available</h2>
          <p>Please contact support or try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Filter to only show starter cards (1-star cards)
  const starterCards = cards.filter(card => card.starLevel === 1);
  const cardsPerPage = 4;

  // Calculate total pages and current page's cards
  const totalPages = Math.ceil(starterCards.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const displayedCards = starterCards.slice(startIndex, startIndex + cardsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleCardSelect = (index: number) => {
    setSelectedCard(index + startIndex);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      if (currentTab === 'register') {
        if (!selectedCard) {
          setError('Please select a starter card first');
          return;
        }

        if (!characterName) {
          setError('Please enter a character name');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        // Create new user with selected card
        const selectedCardData = starterCards[selectedCard];
        
        // Ensure the card data is complete
        if (!selectedCardData.imageUrl) {
          console.error('Card is missing imageUrl:', selectedCardData);
          setError('Invalid card data');
          return;
        }

        const result = await updatePlayer({
          ...currentPlayer,
          username,
          email,
          hasStarterCard: true,
          activeCard: selectedCardData,
          inventory: [selectedCardData],
          character: {
            id: selectedCardData.id,
            name: characterName,
            class: selectedCardData.class,
            className: selectedCardData.category,
            imageUrl: selectedCardData.imageUrl,
            starRank: selectedCardData.starLevel || 1,
            stats: {
              power: selectedCardData.stats?.attack || 10,
              energy: selectedCardData.stats?.energy || 100,
              health: selectedCardData.stats?.health || 100,
              defense: selectedCardData.stats?.defense || 5
            }
          },
          stats: {
            ...currentPlayer.stats,
            level: 1,
            experience: 0,
            gamesPlayed: 0,
            wins: 0,
            coins: 100
          }
        });

        console.log('Player Update Result:', result);
        
        if (result) {
          navigate('/game');
        } else {
          setError('Failed to update player');
        }
      } else {
        // Login existing user
        const result = await loginPlayer(loginUsername, loginPassword);
        
        if (result.success) {
          if (result.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/game');
          }
        } else {
          setError(result.error || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-auto"
         style={{ backgroundImage: 'url("/src/components/ui/797270145169939246.png")' }}>
      {/* Grid overlay with neon effect */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 20, 147, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 20, 147, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-screen p-4 lg:p-6 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x"
                style={{ 
                  fontFamily: "'Righteous', cursive",
                  textShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
                }}>
              Welcome to The wHO House
            </h1>
            <p className="text-lg text-pink-300/80"
               style={{ fontFamily: "'Quicksand', sans-serif" }}>
              Select your starting card
            </p>
          </div>

          <div className="bg-pink-500/10 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6 relative overflow-hidden"
              style={{
                boxShadow: '0 0 20px rgba(255, 20, 147, 0.2), inset 0 0 20px rgba(255, 20, 147, 0.1)'
              }}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 relative z-10">
              {/* Starter Cards Section */}
              <div>
                {/* Character Name Section */}
                {currentTab === 'register' && (
                  <div className="mb-8">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 
                                   text-transparent bg-clip-text animate-gradient-x
                                   drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        Name Your Character
                      </h3>
                      {/* Fancy Divider */}
                      <div className="relative flex items-center justify-center my-4">
                        <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                        <div className="absolute flex justify-center items-center bg-black/20 backdrop-blur-sm rounded-full w-8 h-8 
                                      border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                          <FaUser className="w-3 h-3 text-pink-400" />
                        </div>
                      </div>
                    </div>
                    <div className="max-w-md mx-auto">
                      <input
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        required
                        className="w-full bg-black/40 backdrop-blur-sm border border-pink-500/30 rounded-xl px-4 py-3 
                                 text-white text-lg text-center placeholder-gray-400 
                                 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20
                                 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                        placeholder="Enter your character's name"
                      />
                    </div>
                  </div>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayedCards.map((card, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                        selectedCard === index + startIndex 
                          ? 'border-[3px] border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] rounded-xl' 
                          : 'border-[3px] border-transparent'
                      }`}
                      onClick={() => handleCardSelect(index)}
                    >
                      <div className="relative rounded-xl overflow-hidden bg-gray-900/60 backdrop-blur-sm
                                    shadow-[0_0_15px_rgba(0,0,0,0.3)] group h-[500px]">
                        {/* Star Level Badge */}
                        <div className="absolute top-3 right-3 z-20 flex gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1.5
                                      border border-white/10 shadow-lg">
                          {[...Array(card.starLevel || 0)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 w-3.5 h-3.5 drop-shadow-[0_2px_3px_rgba(234,179,8,0.3)]" />
                          ))}
                        </div>
                        
                        {/* Rarity Badge */}
                        <div className="absolute top-3 left-3 z-20">
                          <span className={`text-xs font-medium px-2.5 py-1.5 rounded-full shadow-lg backdrop-blur-sm
                            ${card.rarity === 'Common' ? 'bg-gray-500/70 text-white border border-gray-400/30' :
                              card.rarity === 'Uncommon' ? 'bg-green-500/70 text-white border border-green-400/30' :
                              card.rarity === 'Rare' ? 'bg-blue-500/70 text-white border border-blue-400/30' :
                              card.rarity === 'Epic' ? 'bg-purple-500/70 text-white border border-purple-400/30' :
                              'bg-yellow-500/70 text-white border border-yellow-400/30'
                            }`}>
                            {card.rarity || 'Common'}
                          </span>
                        </div>

                        <div className="h-full">
                          <img 
                            src={card.imageUrl} 
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Card info overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent 
                                        opacity-0 group-hover:opacity-100 transition-all duration-300">
                          </div>
                          {/* Bottom gradient for name */}
                          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t 
                                        from-black via-black/90 to-transparent pointer-events-none">
                          </div>
                          {/* Card content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                              {card.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-black/40 backdrop-blur-sm border border-pink-500/20 p-1.5 rounded-lg text-center
                                            shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                                <span className="block text-gray-400 text-[10px] font-medium">ATK</span>
                                <span className="text-pink-400 text-sm font-bold">{card.stats.attack}</span>
                              </div>
                              <div className="bg-black/40 backdrop-blur-sm border border-pink-500/20 p-1.5 rounded-lg text-center
                                            shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                                <span className="block text-gray-400 text-[10px] font-medium">DEF</span>
                                <span className="text-pink-400 text-sm font-bold">{card.stats.defense}</span>
                              </div>
                              <div className="bg-black/40 backdrop-blur-sm border border-pink-500/20 p-1.5 rounded-lg text-center
                                            shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                                <span className="block text-gray-400 text-[10px] font-medium">HP</span>
                                <span className="text-pink-400 text-sm font-bold">{card.stats.health}</span>
                              </div>
                              <div className="bg-black/40 backdrop-blur-sm border border-pink-500/20 p-1.5 rounded-lg text-center
                                            shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                                <span className="block text-gray-400 text-[10px] font-medium">Energy</span>
                                <span className="text-pink-400 text-sm font-bold">{card.stats.energy}</span>
                              </div>
                            </div>
                            {card.skills && card.skills.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="space-y-1.5">
                                  {card.skills.map((skill, index) => (
                                    <div key={index} 
                                         className="bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-pink-400 text-xs font-medium
                                                  border border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                                      {skill}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Selection glow effect */}
                      {selectedCard === index + startIndex && (
                        <div className="absolute -inset-[3px] rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 
                                      animate-gradient-x -z-10"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Card Navigation */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="p-2 rounded-full bg-pink-500/20 text-pink-400 disabled:opacity-50 
                               hover:bg-pink-500/30 transition-all duration-300"
                    >
                      <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-pink-400">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="p-2 rounded-full bg-pink-500/20 text-pink-400 disabled:opacity-50 
                               hover:bg-pink-500/30 transition-all duration-300"
                    >
                      <FaChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Auth Form Section */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
                  <div className="flex bg-gray-800/50 p-1 rounded-lg mb-4">
                    <button
                      className={`flex-1 py-2 px-4 rounded-md transition-all ${
                        currentTab === 'register'
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'text-gray-400 hover:text-pink-300'
                      }`}
                      onClick={() => setCurrentTab('register')}
                    >
                      Register
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-md transition-all ${
                        currentTab === 'login'
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'text-gray-400 hover:text-pink-300'
                      }`}
                      onClick={() => setCurrentTab('login')}
                    >
                      Login
                    </button>
                  </div>

                  {currentTab === 'register' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-1">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="w-full bg-gray-800/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500/50"
                          placeholder="Enter username"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-gray-800/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500/50"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full bg-gray-800/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500/50"
                          placeholder="Enter password"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full bg-gray-800/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500/50"
                          placeholder="Confirm password"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedCard}
                      >
                        Create Character & Start Game
                      </button>
                      {error && (
                        <p className="text-red-400 text-sm mt-2">{error}</p>
                      )}
                    </form>
                  ) : (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                      <div className="space-y-3">
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-pink-500/10 rounded-lg py-2 px-9 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/30"
                            placeholder="Username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                          />
                        </div>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                          <input
                            type="password"
                            className="w-full bg-gray-800/50 border border-pink-500/10 rounded-lg py-2 px-9 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/30"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      <button type="submit" className="w-full bg-pink-500/20 text-pink-400 rounded-lg py-2 text-sm font-medium transition-all hover:bg-pink-500/30">
                        Login & Start Game
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentPlayer && (
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6">Welcome {currentPlayer.username}!</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
