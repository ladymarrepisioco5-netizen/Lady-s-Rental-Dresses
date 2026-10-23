import React from 'react';
import { Sparkles } from 'lucide-react';

interface CollectionGardenProps {
  opacity?: number;
  scale?: number;
}

export const CollectionGarden: React.FC<CollectionGardenProps> = ({
  opacity = 1,
  scale = 1
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out overflow-hidden"
      style={{
        opacity,
        transform: `scale(${scale})`
      }}
    >
      {/* Luminous Garden Background (Generated high-res garden asset) */}
      <img
        src="/src/assets/images/glowing_collection_garden_1792003770484.jpg"
        alt="Glowing Collection Garden"
        className="w-full h-full object-cover object-center"
      />

      {/* Atmospheric Overlays: Soft Magenta, Turquoise & Amber Mist */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-[#09090d]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-400/10 via-pink-500/10 to-transparent pointer-events-none" />

      {/* Glowing Bioluminescent Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${(i * 19 + 5) % 94}%`,
              top: `${(i * 27 + 10) % 90}%`,
              width: `${(i % 3) * 2 + 2}px`,
              height: `${(i % 3) * 2 + 2}px`,
              boxShadow: i % 2 === 0 ? '0 0 10px #f472b6, 0 0 20px #f472b6' : '0 0 10px #2dd4bf, 0 0 20px #2dd4bf',
              animationDuration: `${2 + (i % 4)}s`,
              animationDelay: `${(i * 0.4) % 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
