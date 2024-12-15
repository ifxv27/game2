import React from 'react';
import { motion } from 'framer-motion';

export const BattleArena: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sexy Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* Glowing Grid Lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`horizontal-${i}`}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
              style={{ top: `${(i + 1) * 12.5}%` }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleY: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`vertical-${i}`}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"
              style={{ left: `${(i + 1) * 12.5}%` }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleX: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Square Battle Arena */}
      <div className="relative w-[85vw] h-[85vh] flex items-center justify-center">
        {/* Outer Glow Box */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-950/40 via-purple-900/30 to-indigo-950/40">
          {/* Animated Shadow Borders */}
          <motion.div
            className="absolute -inset-1 rounded-xl bg-violet-600/30 blur-xl"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        {/* Inner Arena */}
        <div className="relative w-full h-full rounded-xl border-2 border-violet-400/10 overflow-hidden">
          {/* Glass Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-purple-950/70 to-indigo-950/80 backdrop-blur-md" />
          
          {/* Content Grid - Adjusted spacing */}
          <div className="relative h-full grid grid-rows-[1fr_auto_1fr] gap-4 p-8">
            {/* Opponent Area */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Card Placement Indicator */}
                <motion.div
                  className="absolute -inset-4 rounded-xl"
                  animate={{
                    boxShadow: [
                      '0 0 30px 4px rgba(139, 92, 246, 0.2)',
                      '0 0 50px 6px rgba(139, 92, 246, 0.2)',
                      '0 0 30px 4px rgba(139, 92, 246, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {children?.[0]} {/* Opponent Card */}
              </div>
            </div>

            {/* Center Divider - Made more compact */}
            <div className="relative flex items-center justify-center h-24">
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
              
              {/* Sexy Center Emblem - Adjusted size */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="w-24 h-24 relative">
                  {/* Rotating Diamond */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ rotate: 45 }}
                  >
                    <div className="absolute inset-0 border-2 border-violet-400/20" />
                    <div className="absolute inset-0 border-2 border-violet-500/10 animate-spin-slow" />
                  </motion.div>
                  
                  {/* Inner Square */}
                  <div className="absolute inset-4 bg-gradient-to-br from-violet-800/30 to-purple-700/20 backdrop-blur-lg" />
                  
                  {/* VS Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-200 to-purple-400">
                      VS
                    </span>
                  </div>

                  {/* Decorative Lines */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`line-${i}`}
                      className="absolute top-1/2 left-1/2 w-16 h-[2px] origin-left"
                      style={{
                        rotate: `${i * 90}deg`,
                        background: 'linear-gradient(to right, transparent, rgba(167, 139, 250, 0.4), transparent)',
                      }}
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Player Area */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Card Placement Indicator */}
                <motion.div
                  className="absolute -inset-4 rounded-xl"
                  animate={{
                    boxShadow: [
                      '0 0 30px 4px rgba(139, 92, 246, 0.2)',
                      '0 0 50px 6px rgba(139, 92, 246, 0.2)',
                      '0 0 30px 4px rgba(139, 92, 246, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {children?.[1]} {/* Player Card */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`corner-${i}`}
          className="absolute w-64 h-64"
          style={{
            ...(i === 0 && { top: 0, left: 0 }),
            ...(i === 1 && { top: 0, right: 0, transform: 'scaleX(-1)' }),
            ...(i === 2 && { bottom: 0, left: 0, transform: 'scaleY(-1)' }),
            ...(i === 3 && { bottom: 0, right: 0, transform: 'scale(-1)' }),
          }}
        >
          <motion.div
            className="w-full h-full border-l-2 border-t-2 rounded-tl-2xl border-violet-500/20"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
};
