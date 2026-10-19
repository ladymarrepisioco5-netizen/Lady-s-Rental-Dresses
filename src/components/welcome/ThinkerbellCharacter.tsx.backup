import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

export type FairyStage =
  | 'WELCOME'
  | 'FAIRY_APPROACHES_BUTTON'
  | 'FAIRY_CLICKS_BUTTON'
  | 'DOOR_OPENS'
  | 'ENTER_COLLECTION_GARDEN'
  | 'THINKERBELL_DIALOGUE'
  | 'DRESS_COLLECTION';

interface ThinkerbellCharacterProps {
  stage: FairyStage;
  customX?: number; // percentage 0-100
  customY?: number; // percentage 0-100
  speechMessage?: string;
  showSpeech?: boolean;
  onFairyClick?: () => void;
}

export const ThinkerbellCharacter: React.FC<ThinkerbellCharacterProps> = ({
  stage,
  customX,
  customY,
  speechMessage,
  showSpeech = true,
  onFairyClick
}) => {
  // Calculated flight position based on active stage
  const { x, y, rotation, scale, gesture } = useMemo(() => {
    if (customX !== undefined && customY !== undefined) {
      return { x: customX, y: customY, rotation: 0, scale: 1, gesture: 'hover' };
    }

    switch (stage) {
      case 'WELCOME':
        // Hovering gently in the garden to the right or left of the turquoise door
        return { x: 74, y: 38, rotation: -4, scale: 0.95, gesture: 'hover' };

      case 'FAIRY_APPROACHES_BUTTON':
        // Swooping in a curved arc toward the Explore Collection button (positioned near the button at bottom center)
        return { x: 58, y: 76, rotation: 8, scale: 1.05, gesture: 'point' };

      case 'FAIRY_CLICKS_BUTTON':
        // Extended right at the center of the button, pressing it!
        return { x: 50, y: 82, rotation: 12, scale: 1.12, gesture: 'click' };

      case 'DOOR_OPENS':
        // Ascending gracefully while gesturing toward the opening turquoise portal
        return { x: 30, y: 44, rotation: -12, scale: 0.9, gesture: 'gesture_door' };

      case 'ENTER_COLLECTION_GARDEN':
        // Flying forward right into the center of the glowing doorway
        return { x: 50, y: 50, rotation: 0, scale: 0.75, gesture: 'fly_forward' };

      case 'THINKERBELL_DIALOGUE':
        // Prominently hovering beside the dialogue panel
        return { x: 50, y: 28, rotation: 0, scale: 1.15, gesture: 'speak' };

      case 'DRESS_COLLECTION':
        // Docked in the corner as a helpful guide
        return { x: 92, y: 88, rotation: 0, scale: 0.8, gesture: 'docked' };

      default:
        return { x: 70, y: 40, rotation: 0, scale: 1, gesture: 'hover' };
    }
  }, [stage, customX, customY]);

  // Trail particles for fairy dust
  const trailDust = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      offsetX: (Math.sin(i * 1.3) * 18) - 12,
      offsetY: 20 + i * 8,
      size: 4 - (i % 3),
      delay: i * 0.12
    }));
  }, []);

  return (
    <div
      onClick={onFairyClick}
      className={`absolute z-30 transition-all pointer-events-auto cursor-pointer ${
        stage === 'FAIRY_APPROACHES_BUTTON'
          ? 'duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)]'
          : stage === 'FAIRY_CLICKS_BUTTON'
          ? 'duration-300 ease-out'
          : stage === 'DOOR_OPENS'
          ? 'duration-[1400ms] ease-out'
          : stage === 'ENTER_COLLECTION_GARDEN'
          ? 'duration-[1200ms] ease-in'
          : 'duration-700 ease-in-out'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        filter: 'drop-shadow(0 0 16px rgba(45,212,191,0.65))'
      }}
      title="Thinkerbell — Your Magical Fairy Guide"
    >
      {/* 1. FAIRY GLOW & AURA */}
      <div className="absolute -inset-6 bg-gradient-to-r from-teal-400/40 via-pink-400/40 to-amber-300/40 rounded-full blur-xl animate-pulse pointer-events-none" />

      {/* 2. REAL ANIMATED TRANSLUCENT WINGS FLUTTERING */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-24 pointer-events-none z-0">
        {/* Left Wing with high-frequency flutter */}
        <div
          className="absolute right-1/2 top-0 w-16 h-20 origin-bottom-right"
          style={{
            animation: 'wingFlutterLeft 0.16s ease-in-out infinite alternate',
            transformOrigin: 'bottom right'
          }}
        >
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]">
            <path
              d="M90,110 C80,70 30,40 10,10 C40,20 85,50 95,80 Z"
              fill="url(#wingGradient)"
              fillOpacity="0.82"
              stroke="#5eead4"
              strokeWidth="2"
            />
            <path
              d="M90,110 C60,95 40,80 20,60"
              stroke="#fef08a"
              strokeWidth="1.2"
              fill="none"
              strokeOpacity="0.7"
            />
            <defs>
              <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#5eead4" stopOpacity="0.75" />
                <stop offset="80%" stopColor="#f472b6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right Wing with high-frequency flutter */}
        <div
          className="absolute left-1/2 top-0 w-16 h-20 origin-bottom-left"
          style={{
            animation: 'wingFlutterRight 0.16s ease-in-out infinite alternate',
            transformOrigin: 'bottom left'
          }}
        >
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]">
            <path
              d="M10,110 C20,70 70,40 90,10 C60,20 15,50 5,80 Z"
              fill="url(#wingGradientRight)"
              fillOpacity="0.82"
              stroke="#5eead4"
              strokeWidth="2"
            />
            <path
              d="M10,110 C40,95 60,80 80,60"
              stroke="#fef08a"
              strokeWidth="1.2"
              fill="none"
              strokeOpacity="0.7"
            />
            <defs>
              <linearGradient id="wingGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#5eead4" stopOpacity="0.75" />
                <stop offset="80%" stopColor="#f472b6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 3. THINKERBELL BODY & CHARACTER AVATAR */}
      <div
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-teal-400 via-emerald-300 to-amber-200 shadow-[0_0_25px_rgba(20,184,166,0.8)] overflow-hidden"
        style={{
          animation: 'fairyBob 2.2s ease-in-out infinite'
        }}
      >
        <img
          src="/src/assets/images/thinkerbell_fairy_guide_1792003754140.jpg"
          alt="Thinkerbell Fairy Guide"
          className="w-full h-full object-cover rounded-full"
        />

        {/* Gesturing Hand / Wand Effect */}
        {gesture === 'click' && (
          <div className="absolute inset-0 bg-white/30 rounded-full animate-ping pointer-events-none" />
        )}
      </div>

      {/* 4. EXTENDING WAND / POINTING SPARKLE IN GESTURE MODE */}
      {(gesture === 'point' || gesture === 'click') && (
        <div
          className={`absolute -bottom-2 -left-2 z-20 flex items-center gap-1 transition-all ${
            gesture === 'click' ? 'scale-150 animate-ping' : 'animate-bounce'
          }`}
        >
          <Sparkles className="w-6 h-6 text-amber-200 fill-amber-200 drop-shadow-[0_0_10px_#fff]" />
        </div>
      )}

      {/* 5. GLOWING FAIRY DUST PARTICLES TRAILING BEHIND */}
      <div className="absolute inset-0 pointer-events-none">
        {trailDust.map(t => (
          <div
            key={t.id}
            className="absolute rounded-full bg-gradient-to-r from-amber-200 to-teal-200 shadow-[0_0_6px_#fef08a] animate-ping"
            style={{
              left: `calc(50% + ${t.offsetX}px)`,
              top: `calc(75% + ${t.offsetY}px)`,
              width: `${t.size}px`,
              height: `${t.size}px`,
              animationDuration: '1.2s',
              animationDelay: `${t.delay}s`
            }}
          />
        ))}
      </div>

      {/* 6. SPEECH BUBBLE (When Active) */}
      {showSpeech && speechMessage && (
        <div
          className="absolute left-1/2 -top-16 -translate-x-1/2 w-60 sm:w-72 bg-[#0b0f14]/90 backdrop-blur-md border border-teal-400/60 rounded-2xl p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-center text-xs text-white transition-all animate-fade-in pointer-events-none z-30"
        >
          <div className="flex items-center justify-center gap-1 font-semibold text-teal-300 text-[11px] uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Thinkerbell • Fairy Guide</span>
          </div>
          <p className="font-serif italic text-pink-100 text-xs sm:text-[13px] leading-snug">
            "{speechMessage}"
          </p>
          {/* Triangular Pointer Beak */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-[#0b0f14]/90 border-b border-r border-teal-400/60 rotate-45" />
        </div>
      )}

      {/* Embedded CSS Keyframes for Real Wing Flapping and Bobbing */}
      <style>{`
        @keyframes wingFlutterLeft {
          0% { transform: rotate(18deg) scaleX(0.7) scaleY(1.05); }
          100% { transform: rotate(-8deg) scaleX(1.15) scaleY(0.95); }
        }
        @keyframes wingFlutterRight {
          0% { transform: rotate(-18deg) scaleX(0.7) scaleY(1.05); }
          100% { transform: rotate(8deg) scaleX(1.15) scaleY(0.95); }
        }
        @keyframes fairyBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};
