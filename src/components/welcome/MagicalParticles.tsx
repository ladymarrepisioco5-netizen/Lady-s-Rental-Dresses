import React, { useMemo } from 'react';

interface MagicalParticlesProps {
  count?: number;
  interactive?: boolean;
}

export const MagicalParticles: React.FC<MagicalParticlesProps> = ({ count = 35 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = (i % 4) * 1.5 + 2; // 2px to 6.5px
      const isGold = i % 3 === 0;
      const isTeal = i % 3 === 1;
      const color = isGold ? '#fef08a' : isTeal ? '#2dd4bf' : '#f472b6';
      const glow = isGold ? 'rgba(254,240,138,0.8)' : isTeal ? 'rgba(45,212,191,0.8)' : 'rgba(244,114,182,0.8)';
      const left = ((i * 19 + 7) % 96) + 2;
      const top = ((i * 23 + 13) % 94) + 3;
      const duration = 2.5 + (i % 5) * 0.8;
      const delay = (i * 0.3) % 4;

      return {
        id: i,
        size,
        color,
        glow,
        left,
        top,
        duration,
        delay
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.glow}, 0 0 ${p.size * 6}px ${p.glow}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transition: 'opacity 1s ease'
          }}
        />
      ))}
    </div>
  );
};
