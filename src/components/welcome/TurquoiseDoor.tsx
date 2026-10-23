import React from 'react';

interface DoorRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface TurquoiseDoorProps {
  isOpen: boolean;
  onDoorFullyOpen?: () => void;
  imageSrc?: string;
  doorRect?: DoorRect;
  archRadius?: number;
}

export const TurquoiseDoor: React.FC<TurquoiseDoorProps> = ({
                                                              isOpen,
                                                              onDoorFullyOpen,
                                                              imageSrc = '/src/assets/images/Door.png',
                                                              doorRect = { top: 20, right: 31, bottom: 25, left: 31 },
                                                              archRadius = 30,
                                                            }) => {
  const { top, right, bottom, left } = doorRect;
  const clip = `inset(${top}% ${right}% ${bottom}% ${left}% round 50% 50% 0 0 / ${archRadius}% ${archRadius}% 0 0)`;

  return (
      <div className="relative w-full max-w-[520px] mx-auto select-none">
        <img src={imageSrc} alt="Enchanted turquoise door" className="block w-full h-auto" draggable={false} />

        <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ clipPath: clip, opacity: isOpen ? 1 : 0 }}
        >
          <div
              className="absolute inset-0 animate-pulse"
              style={{
                background:
                    'radial-gradient(ellipse at center, #ffffff 0%, #fef08a 35%, #f9a8d4 65%, #0d9488 100%)',
              }}
          />
        </div>

        <div
            className="absolute inset-0 cursor-pointer"
            style={{
              clipPath: clip,
              transformOrigin: `${left}% 50%`,
              transform: isOpen ? 'perspective(1200px) rotateY(-105deg)' : 'perspective(1200px) rotateY(0deg)',
              transition: 'transform 1800ms cubic-bezier(0.2, 0.85, 0.4, 1)',
              backfaceVisibility: 'hidden',
            }}
            onTransitionEnd={(e) => {
              if (isOpen && e.propertyName === 'transform') onDoorFullyOpen?.();
            }}
        >
          <img src={imageSrc} alt="" className="block w-full h-auto" draggable={false} />
        </div>
      </div>
  );
};