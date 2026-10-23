import React, { useEffect, useState } from 'react';
import PinkEntrance from '../assets/images/PinkEntrance.png';

const IMAGE = PinkEntrance;
// Bilis ng pagbukas sa milliseconds.
const OPEN_MS = 4000;
const EASE = 'cubic-bezier(0.4, 0, 0.6, 1)';
// Gaano kalawak bumukas ang pinto (degrees).
const ANGLE = 80;
// Kapal ng frame ng pinto (px).
const FRAME = 14;

const GOLD = 'linear-gradient(145deg, #f3e2b3, #c9a86a 50%, #8a6b30)';

export const DoorIntro: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setVisible(false), OPEN_MS + 600);
  };

  if (!visible) return null;

  const leaf = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top: FRAME,
    bottom: FRAME,
    [side]: FRAME,
    width: `calc(50% - ${FRAME}px)`,
    overflow: 'hidden',
    transformOrigin: side === 'left' ? 'left center' : 'right center',
    transform: opening
      ? `rotateY(${side === 'left' ? ANGLE : -ANGLE}deg)`
      : 'rotateY(0deg)',
    transition: `transform ${OPEN_MS}ms ${EASE}`,
    willChange: 'transform',
    backgroundColor: '#e48fb4',
  });

  const pic = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    [side]: 0,
    width: `calc(100vw - ${FRAME * 2}px)`,
    height: '100%',
    backgroundImage: `url(${IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  });

  const shade = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, rgba(0,0,0,0.05), rgba(0,0,0,0.6))`,
    opacity: opening ? 1 : 0,
    transition: `opacity ${OPEN_MS}ms ${EASE}`,
    pointerEvents: 'none',
  });

  const knob = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top: '52%',
    [side === 'left' ? 'right' : 'left']: 22,
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #fff3cf, #c9a86a 55%, #6e5224)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
  });

  const hinge = (side: 'left' | 'right', top: string): React.CSSProperties => ({
    position: 'absolute',
    top,
    [side]: 0,
    width: 10,
    height: 48,
    background: GOLD,
    borderRadius: 2,
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
  });

  const renderLeaf = (side: 'left' | 'right') => (
    <div style={leaf(side)}>
      <div style={pic(side)} />
      <div style={shade(side)} />
      <div style={knob(side)} />
      {['10%', '48%', '84%'].map((t) => (
        <div key={t} style={hinge(side, t)} />
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{
        perspective: '1800px',
        pointerEvents: opening ? 'none' : 'auto',
        opacity: opening ? 0 : 1,
        transition: opening ? `opacity 400ms ease ${OPEN_MS - 100}ms` : undefined,
      }}
      role="dialog"
      aria-label="Welcome door"
    >
      {/* mainit na liwanag sa likod ng pinto */}
      <div
        style={{
          position: 'absolute',
          inset: FRAME,
          background:
            'radial-gradient(ellipse at center, #f4b8d0 0%, #dc8fb0 55%, #b8678c 100%)',
          opacity: opening ? 1 : 0,
          transition: `opacity ${OPEN_MS}ms ease`,
          pointerEvents: 'none',
        }}
      />

      {renderLeaf('left')}
      {renderLeaf('right')}

      {/* guhit sa gitna ng dalawang dahon */}
      <div
        style={{
          position: 'absolute',
          top: FRAME,
          bottom: FRAME,
          left: '50%',
          width: 4,
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(to right, rgba(0,0,0,0.4), rgba(255,255,255,0.25), rgba(0,0,0,0.4))',
          opacity: opening ? 0 : 1,
          transition: 'opacity 300ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* frame ng pinto */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${FRAME}px solid #b8935a`,
          boxShadow:
            'inset 0 0 0 2px rgba(255,255,255,0.25), inset 0 0 30px rgba(0,0,0,0.55)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="absolute inset-x-0 flex flex-col items-center gap-6"
        style={{
          bottom: '9vh',
          opacity: opening ? 0 : 1,
          transition: 'opacity 400ms ease',
        }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-white drop-shadow-lg">
          Lady&rsquo;s Rental
        </p>
        <button
          onClick={handleOpen}
          className="rounded-full bg-white/90 px-8 py-3 text-sm font-medium text-neutral-900 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a86a]"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

export default DoorIntro;

