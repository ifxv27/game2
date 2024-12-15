import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  running: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

export const BattleEffects: React.FC<{
  type: 'attack' | 'defense' | 'special' | 'ultimate';
  position: { x: number; y: number };
  onComplete: () => void;
}> = ({ type, position, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);

  // Initialize particle system
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    systemRef.current = {
      canvas,
      ctx,
      particles: [],
      running: true
    };

    // Create initial particles based on effect type
    createParticles(type, position);

    // Start animation loop
    requestAnimationFrame(animate);

    return () => {
      if (systemRef.current) {
        systemRef.current.running = false;
      }
    };
  }, [type, position]);

  const createParticles = (type: string, pos: { x: number; y: number }) => {
    if (!systemRef.current) return;

    const { particles } = systemRef.current;
    const count = type === 'ultimate' ? 200 : 100;
    
    const colors = {
      attack: ['#ff0055', '#ff0088', '#ff00aa'],
      defense: ['#00ffff', '#00aaff', '#0077ff'],
      special: ['#ff00ff', '#aa00ff', '#7700ff'],
      ultimate: ['#ff0000', '#ff00ff', '#7700ff', '#00ffff']
    }[type] || ['#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 5 + 2;
      const size = Math.random() * 4 + 2;
      
      particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 0.5 + 0.5,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }
  };

  const animate = () => {
    if (!systemRef.current || !systemRef.current.running) return;
    const { ctx, particles, canvas } = systemRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Apply gravity for some effects
      if (type === 'attack' || type === 'ultimate') {
        p.vy += 0.1;
      }

      // Update life
      p.life -= 0.016; // Roughly 60fps
      p.alpha = p.life / p.maxLife;

      // Remove dead particles
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Draw particle
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = p.color;

      // Draw based on effect type
      if (type === 'special' || type === 'ultimate') {
        // Star shape for special effects
        const rot = (Date.now() / 1000) * Math.PI * 2;
        ctx.translate(p.x, p.y);
        ctx.rotate(rot);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const len = i === 0 ? p.size * 2 : p.size;
          const x = Math.cos(angle) * len;
          const y = Math.sin(angle) * len;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Circle for normal effects
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Add trail effect for ultimate
    if (type === 'ultimate') {
      ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Continue animation if particles exist
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </AnimatePresence>
  );
};
