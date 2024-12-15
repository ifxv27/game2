import React, { useState, useEffect } from 'react';
import { GameResult } from './types';

interface MemoryGameProps {
  difficulty: number;
  duration: number;
  onComplete: (result: GameResult) => void;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  difficulty,
  duration,
  onComplete
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize cards based on difficulty
  useEffect(() => {
    const cardCount = Math.min(8 + (difficulty * 2), 20);
    const values = Array.from({ length: cardCount / 2 }, (_, i) => String.fromCodePoint(127183 + i));
    const shuffledCards = [...values, ...values]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const handleCardClick = (id: number) => {
    if (!gameStarted) setGameStarted(true);
    if (flippedCards.length === 2 || cards[id].isMatched) return;

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    setFlippedCards(prev => [...prev, id]);

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const [firstCard] = flippedCards;
      if (cards[firstCard].value === cards[id].value) {
        // Match found
        setCards(prev => prev.map(card => 
          card.id === firstCard || card.id === id
            ? { ...card, isMatched: true }
            : card
        ));
        setMatches(prev => prev + 1);
        setFlippedCards([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstCard || card.id === id
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameEnd = () => {
    const totalPairs = cards.length / 2;
    const score = Math.floor(
      (matches / totalPairs) * 1000 + 
      (timeLeft * 10) - 
      (moves * 5)
    );

    const result: GameResult = {
      score: Math.max(0, score),
      success: matches >= totalPairs * 0.7, // 70% completion for success
      bonusMultiplier: matches === totalPairs ? 1.5 : 1,
      timeSpent: duration - timeLeft,
      perfectBonus: matches === totalPairs && moves < totalPairs * 2
    };

    onComplete(result);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <div className="mb-4 flex justify-between">
        <div>Matches: {matches}/{cards.length/2}</div>
        <div>Moves: {moves}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg text-3xl flex items-center justify-center
              ${card.isFlipped || card.isMatched 
                ? 'bg-blue-500' 
                : 'bg-gray-600 hover:bg-gray-500'}`}
            disabled={card.isMatched}
          >
            {(card.isFlipped || card.isMatched) ? card.value : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};
