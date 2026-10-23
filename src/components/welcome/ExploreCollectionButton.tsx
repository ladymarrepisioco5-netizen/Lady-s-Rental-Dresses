import React, { forwardRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ExploreCollectionButtonProps {
  onClick: () => void;
  isTriggered: boolean;
  isFairyHoveringNear?: boolean;
  disabled?: boolean;
}

export const ExploreCollectionButton = forwardRef<HTMLButtonElement, ExploreCollectionButtonProps>(
  ({ onClick, isTriggered, isFairyHoveringNear, disabled }, ref) => {
    return (
      <div className="relative inline-flex items-center justify-center group select-none">
        {/* Pulsing Ethereal Halo / Interaction Ripple */}
        <div
          className={`absolute -inset-2 rounded-full transition-all duration-700 pointer-events-none ${
            isTriggered
              ? 'bg-gradient-to-r from-teal-400 via-pink-500 to-amber-300 blur-xl opacity-90 scale-125 animate-ping'
              : isFairyHoveringNear
              ? 'bg-gradient-to-r from-teal-400 via-pink-400 to-amber-300 blur-lg opacity-80 scale-110 animate-pulse'
              : 'bg-pink-500/30 blur-md opacity-40 group-hover:opacity-75 group-hover:scale-105'
          }`}
        />

        {/* Outer Ring Sparkles */}
        {isTriggered && (
          <div className="absolute inset-0 rounded-full border-2 border-white animate-ping pointer-events-none" />
        )}

        {/* The Actual "Explore Collection" Interactive Button */}
        <button
          ref={ref}
          id="explore-collection-btn"
          type="button"
          onClick={onClick}
          disabled={disabled || isTriggered}
          aria-label="Explore Collection - Enter Lady's Rental boutique"
          className={`relative z-10 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full font-serif font-bold text-sm sm:text-base tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] ${
            isTriggered
              ? 'bg-gradient-to-r from-teal-400 via-pink-500 to-amber-300 text-black scale-95 shadow-[0_0_40px_rgba(45,212,191,0.9)]'
              : isFairyHoveringNear
              ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-teal-500 text-white shadow-[0_0_30px_rgba(244,114,182,0.8)] scale-105'
              : 'bg-gradient-to-r from-pink-600 via-rose-600 to-teal-600 hover:from-pink-500 hover:to-teal-400 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(244,114,182,0.6)] active:scale-95'
          } border border-pink-300/40`}
        >
          <Sparkles
            className={`w-4 h-4 text-amber-200 transition-transform ${
              isTriggered ? 'animate-spin' : 'group-hover:rotate-45'
            }`}
          />
          <span className="drop-shadow-sm font-sans tracking-wider font-semibold">
            {isTriggered ? 'Entering Boutique...' : 'Explore Collection'}
          </span>
          <ArrowRight
            className={`w-4 h-4 text-white transition-transform ${
              isTriggered ? 'translate-x-2' : 'group-hover:translate-x-1'
            }`}
          />
        </button>
      </div>
    );
  }
);

ExploreCollectionButton.displayName = 'ExploreCollectionButton';
