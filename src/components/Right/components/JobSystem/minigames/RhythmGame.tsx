import React, { useState, useEffect, useCallback } from 'react';
import { GameResult } from './types';

interface RhythmGameProps {
  difficulty: number;
  duration: number;
  onComplete: (result: GameResult) => void;
}

interface Note {
  id: number;
  lane: number;
  position: number;
  hit?: 'perfect' | 'good' | 'miss';
}

export const RhythmGame: React.FC<RhythmGameProps> = ({
  difficulty,
  duration,
  onComplete
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const lanes = 4;
  const speed = 2 + difficulty;

  // Generate notes based on difficulty
  useEffect(() => {
    const noteInterval = 1000 - (difficulty * 50);
    let noteId = 0;
    
    const interval = setInterval(() => {
      if (timeLeft <= 0) return;
      
      setNotes(prev => [...prev, {
        id: noteId++,
        lane: Math.floor(Math.random() * lanes),
        position: 0
      }]);
    }, noteInterval);

    return () => clearInterval(interval);
  }, [difficulty, timeLeft, lanes]);

  // Move notes
  useEffect(() => {
    const interval = setInterval(() => {
      setNotes(prev => prev
        .map(note => ({
          ...note,
          position: note.position + speed
        }))
        .filter(note => {
          if (note.position > 100 && !note.hit) {
            setMisses(prev => prev + 1);
            setCombo(0);
            return false;
          }
          return note.position <= 100;
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [speed]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleGameEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleKeyPress = useCallback((lane: number) => {
    setNotes(prev => {
      const targetNote = prev
        .filter(note => note.lane === lane && !note.hit)
        .sort((a, b) => b.position - a.position)[0];

      if (!targetNote) return prev;

      const position = targetNote.position;
      let hitType: 'perfect' | 'good' | 'miss' = 'miss';
      let points = 0;

      if (position >= 80 && position <= 90) {
        hitType = 'perfect';
        points = 100;
        setPerfectHits(p => p + 1);
        setCombo(c => c + 1);
      } else if (position >= 70 && position <= 95) {
        hitType = 'good';
        points = 50;
        setGoodHits(g => g + 1);
        setCombo(c => c + 1);
      } else {
        setMisses(m => m + 1);
        setCombo(0);
      }

      setScore(prev => prev + points * (1 + combo * 0.1));

      return prev.map(note =>
        note.id === targetNote.id ? { ...note, hit: hitType } : note
      );
    });
  }, [combo]);

  const handleGameEnd = () => {
    const totalNotes = perfectHits + goodHits + misses;
    const accuracy = totalNotes > 0 
      ? ((perfectHits + goodHits) / totalNotes) * 100 
      : 0;

    const result: GameResult = {
      score,
      success: accuracy >= 70,
      bonusMultiplier: accuracy >= 95 ? 1.5 : 1,
      timeSpent: duration - timeLeft,
      perfectBonus: accuracy >= 98
    };

    onComplete(result);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <div className="mb-4 flex justify-between">
        <div>Score: {Math.floor(score)}</div>
        <div>Combo: {combo}x</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
        {/* Lanes */}
        <div className="absolute inset-0 grid grid-cols-4 gap-1">
          {Array.from({ length: lanes }).map((_, i) => (
            <div key={i} className="bg-gray-800 relative">
              {/* Hit Zone */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-500 bg-opacity-20" />
            </div>
          ))}
        </div>

        {/* Notes */}
        {notes.map(note => (
          <div
            key={note.id}
            className={`absolute w-1/4 h-8 transition-transform duration-100 ${
              note.hit === 'perfect' ? 'bg-green-500' :
              note.hit === 'good' ? 'bg-yellow-500' :
              note.hit === 'miss' ? 'bg-red-500' :
              'bg-white'
            }`}
            style={{
              left: `${(note.lane / lanes) * 100}%`,
              bottom: `${note.position}%`,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-4 gap-1 mt-4">
        {Array.from({ length: lanes }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleKeyPress(i)}
            className="bg-blue-500 hover:bg-blue-600 py-4 rounded"
          >
            {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="text-green-400">Perfect: {perfectHits}</div>
        <div className="text-yellow-400">Good: {goodHits}</div>
        <div className="text-red-400">Miss: {misses}</div>
      </div>
    </div>
  );
};
