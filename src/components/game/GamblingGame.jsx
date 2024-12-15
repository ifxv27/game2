import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

const GamblingGame = ({ gameType }) => {
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState(null);
  const { playerProfile, updatePlayerProfile } = useGameStore();

  const handleBet = () => {
    if (playerProfile.money < bet) {
      setResult({ message: "Not enough money!", won: false });
      return;
    }

    let won = false;
    let message = '';
    let multiplier = 0;

    switch (gameType) {
      case 'coinflip':
        won = Math.random() < 0.5;
        message = won ? 'Heads - You win!' : 'Tails - You lose!';
        multiplier = won ? 2 : 0;
        break;
      case 'dice':
        const roll = Math.floor(Math.random() * 6) + 1;
        won = roll > 3;
        message = `Rolled a ${roll} - ${won ? 'You win!' : 'You lose!'}`;
        multiplier = won ? 2 : 0;
        break;
      case 'slots':
        const symbols = ['🍒', '🍊', '🍇', '💎'];
        const reels = Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        won = reels.every(symbol => symbol === reels[0]);
        message = `${reels.join(' ')} - ${won ? 'Jackpot!' : 'Try again!'}`;
        multiplier = won ? 4 : 0;
        break;
      case 'cards':
        const cards = ['A', 'K', 'Q', 'J', '10'];
        const playerCard = cards[Math.floor(Math.random() * cards.length)];
        const dealerCard = cards[Math.floor(Math.random() * cards.length)];
        won = cards.indexOf(playerCard) <= cards.indexOf(dealerCard);
        message = `Your card: ${playerCard}, Dealer: ${dealerCard} - ${won ? 'You win!' : 'You lose!'}`;
        multiplier = won ? 2 : 0;
        break;
      default:
        return;
    }

    const winnings = bet * multiplier;
    const newMoney = playerProfile.money - bet + winnings;
    const newWins = playerProfile.wins + (won ? 1 : 0);
    const newLosses = playerProfile.losses + (won ? 0 : 1);

    updatePlayerProfile({
      ...playerProfile,
      money: newMoney,
      wins: newWins,
      losses: newLosses,
    });

    setResult({ message, won, winnings: won ? winnings : 0 });
  };

  if (!playerProfile) {
    return (
      <div className="text-purple-300">Loading game...</div>
    );
  }

  return (
    <div className="gambling-game">
      <div className="game-controls">
        <div className="bet-controls">
          <button 
            onClick={() => setBet(Math.max(10, bet - 10))}
            className="bet-button"
          >
            -
          </button>
          <span className="bet-amount">${bet}</span>
          <button 
            onClick={() => setBet(bet + 10)}
            className="bet-button"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleBet}
          className="play-button"
          disabled={playerProfile.money < bet}
        >
          Place Bet
        </button>
      </div>

      {result && (
        <div className={`result ${result.won ? 'win' : 'loss'}`}>
          <div className="text-lg font-bold">{result.message}</div>
          {result.won && <div className="text-sm">Won: ${result.winnings}</div>}
        </div>
      )}

      <div className="stats">
        <div>Balance: ${playerProfile.money.toLocaleString()}</div>
        <div>Wins: {playerProfile.wins}</div>
        <div>Losses: {playerProfile.losses}</div>
      </div>

      <style>{`
        .gambling-game {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .game-controls {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .bet-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bet-button {
          background: rgba(255, 71, 148, 0.2);
          border: 1px solid rgba(255, 71, 148, 0.3);
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bet-button:hover {
          background: rgba(255, 71, 148, 0.3);
        }

        .bet-amount {
          color: white;
          font-size: 1.2rem;
          min-width: 60px;
          text-align: center;
        }

        .play-button {
          background: linear-gradient(135deg, #ff4794 0%, #ff71a2 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(255, 71, 148, 0.4);
        }

        .play-button:disabled {
          background: #666;
          cursor: not-allowed;
        }

        .result {
          margin: 20px 0;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          color: white;
        }

        .result.win {
          background: rgba(46, 213, 115, 0.3);
          border: 1px solid rgba(46, 213, 115, 0.6);
        }

        .result.loss {
          background: rgba(255, 71, 87, 0.3);
          border: 1px solid rgba(255, 71, 87, 0.6);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: auto;
          color: white;
          text-align: center;
          padding: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default GamblingGame;
