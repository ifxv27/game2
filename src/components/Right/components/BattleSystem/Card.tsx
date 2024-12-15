import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BattleCard } from './types';

interface CardProps {
  card: BattleCard;
  position: 'player' | 'opponent';
  isActive?: boolean;
  isAttacking?: boolean;
  onSelect?: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  position,
  isActive = false,
  isAttacking = false,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for dynamic lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !glowRef.current || !isHovered) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate angle for lighting effect
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleX = (x - centerX) / centerX;
      const angleY = (y - centerY) / centerY;

      // Apply dynamic lighting effect
      cardRef.current.style.transform = `
        perspective(1000px)
        rotateY(${angleX * 10}deg)
        rotateX(${-angleY * 10}deg)
        ${isActive ? 'scale(1.1)' : ''}
      `;

      // Move glow effect
      glowRef.current.style.background = `
        radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0) 50%
        )
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, isActive]);

  return (
    <motion.div
      className={`relative ${position === 'player' ? 'cursor-pointer' : ''}`}
      initial={{ scale: 0, rotate: position === 'player' ? -180 : 180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        y: isActive ? -20 : 0
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <motion.div
        className={`
          relative w-64 h-96
          rounded-xl overflow-hidden
          ${isActive ? 'ring-2 ring-violet-400/50 ring-offset-2 ring-offset-black/50' : ''}
          transform-gpu
        `}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onSelect}
        whileHover={isActive ? { scale: 1.05 } : {}}
      >
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-950">
          {/* Animated Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-violet-500/10"
            animate={{
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Card Content */}
        <div className="relative h-full flex flex-col p-4">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-violet-100">{card.name}</h3>
            <span className="text-sm font-medium text-violet-300">Lvl {card.level}</span>
          </div>

          {/* Card Image */}
          <div className="relative flex-1 mb-3">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-violet-900/50 to-indigo-900/50" />
            <img
              src={card.image}
              alt={card.name}
              className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-90"
            />
            
            {/* Glowing Border Effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  'inset 0 0 30px 4px rgba(139, 92, 246, 0.15)',
                  'inset 0 0 50px 6px rgba(139, 92, 246, 0.15)',
                  'inset 0 0 30px 4px rgba(139, 92, 246, 0.15)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Health Bar */}
            <div className="col-span-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-violet-200">HP</span>
                <span className="text-violet-300">{card.stats.health}/{card.stats.maxHealth}</span>
              </div>
              <div className="h-1.5 bg-violet-950/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-600 to-violet-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(card.stats.health / card.stats.maxHealth) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="col-span-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-violet-200">Energy</span>
                <span className="text-violet-300">{card.stats.energy}/{card.stats.maxEnergy}</span>
              </div>
              <div className="h-1.5 bg-violet-950/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(card.stats.energy / card.stats.maxEnergy) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>

            {/* Attack & Defense Stats */}
            <div className="flex items-center space-x-1.5 bg-violet-950/30 rounded-lg p-1.5">
              <span className="text-xs text-violet-300">ATK</span>
              <span className="text-sm font-medium text-violet-100">{card.stats.attack}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-violet-950/30 rounded-lg p-1.5">
              <span className="text-xs text-violet-300">DEF</span>
              <span className="text-sm font-medium text-violet-100">{card.stats.defense}</span>
            </div>
          </div>

          {/* Moves Preview */}
          <div className="space-y-1.5">
            {card.moves.slice(0, 2).map((move) => (
              <div
                key={move.name}
                className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-violet-900/30 text-violet-200"
              >
                <span>{move.name}</span>
                <span className="text-violet-400">({move.energyCost}⚡)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Particle Effects */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full bg-violet-300/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
