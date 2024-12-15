import React, { useState, useEffect, useCallback } from 'react';

interface TimingGameProps {
  onComplete: (score: number) => void;
  difficulty: number;
  duration: number;
}

export const TimingGame: React.FC<TimingGameProps> = ({
  onComplete,
  difficulty = 1,
  duration = 30,
}) => {
  const [targetPosition, setTargetPosition] = useState(50);
  const [indicator, setIndicator] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const speed = 2 * difficulty;

  // Move the indicator back and forth
  useEffect(() => {
    let animationFrame: number;
    let direction = 1;

    const animate = () => {
      if (isMoving) {
        setIndicator((prev) => {
          const next = prev + speed * direction;
          if (next > 100) {
            direction = -1;
            return 100;
          }
          if (next < 0) {
            direction = 1;
            return 0;
          }
          return next;
        });
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isMoving, speed]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score, onComplete]);

  // Handle click/tap
  const handleClick = useCallback(() => {
    const distance = Math.abs(indicator - targetPosition);
    let points = 0;

    if (distance < 5) points = 100;
    else if (distance < 10) points = 50;
    else if (distance < 15) points = 25;

    setScore((prev) => prev + points);

    // Move target to new random position
    setTargetPosition(Math.random() * 80 + 10);
  }, [indicator, targetPosition]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <div className="mb-4 flex justify-between">
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
        {/* Target Zone */}
        <div
          className="absolute h-full w-4 bg-green-500 opacity-50"
          style={{ left: `${targetPosition}%` }}
        />
        
        {/* Moving Indicator */}
        <div
          className="absolute h-full w-2 bg-white"
          style={{ left: `${indicator}%` }}
        />
      </div>

      <button
        onClick={handleClick}
        className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
      >
        Hit!
      </button>

      <div className="mt-4 text-sm">
        Hit the button when the white line aligns with the green zone!
      </div>
    </div>
  );
};
