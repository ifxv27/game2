import React from 'react';
import { BattleScene } from '../../Right/components/BattleSystem/BattleScene';
import { useGameStore } from '../../../store/gameStore';
import { useCards } from '../../../hooks/useCards';
import { GiCrossedSwords } from 'react-icons/gi';
import { FaStar } from 'react-icons/fa';

export const BattleSystem = () => {
  const { playerProfile, updatePlayerStats } = useGameStore();
  const { getCardsByCategory } = useCards();
  const [selectedBattleCard, setSelectedBattleCard] = React.useState(null);

  const battleCards = getCardsByCategory('BATTLE') || [];
  const playerCards = playerProfile?.inventory || [];

  const handleStartBattle = (opponentCard) => {
    const playerCard = playerCards[0]; // Get first card from player's inventory
    if (!playerCard) {
      alert('You need at least one card in your inventory to battle!');
      return;
    }
    
    setSelectedBattleCard({
      playerCard: {
        ...playerCard,
        stats: {
          health: playerCard.health || 100,
          attack: playerCard.attack || (playerCard.starRank * 10),
          defense: playerCard.defense || (playerCard.starRank * 5),
          energy: playerCard.energy || 100
        }
      },
      opponentCard: {
        ...opponentCard,
        stats: {
          health: opponentCard.health || 100,
          attack: opponentCard.attack || (opponentCard.starRank * 10),
          defense: opponentCard.defense || (opponentCard.starRank * 5),
          energy: opponentCard.energy || 100
        }
      }
    });
  };

  const handleBattleEnd = (winner) => {
    if (winner.id === selectedBattleCard.playerCard.id) {
      updatePlayerStats({
        exp: 100,
        coins: 50,
        wins: 1
      });
    }
    setSelectedBattleCard(null);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-400 flex items-center">
          <GiCrossedSwords className="mr-2" /> Battle Arena
        </h2>
      </div>

      {selectedBattleCard ? (
        <BattleScene
          playerCard={selectedBattleCard.playerCard}
          opponentCard={selectedBattleCard.opponentCard}
          onBattleEnd={handleBattleEnd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {battleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleStartBattle(card)}
              className="bg-black/40 p-4 rounded-lg border border-purple-500/30 cursor-pointer hover:bg-purple-500/20 transition-colors"
            >
              <div className="text-lg font-bold text-purple-400 mb-2">{card.name}</div>
              <div className="flex items-center text-gray-300 mb-1">
                <FaStar className="text-yellow-500 mr-1" />
                Level {card.starRank || 1}
              </div>
              <div className="flex items-center text-gray-300">
                <GiCrossedSwords className="text-red-500 mr-1" />
                Power {card.attack || (card.starRank * 10)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
