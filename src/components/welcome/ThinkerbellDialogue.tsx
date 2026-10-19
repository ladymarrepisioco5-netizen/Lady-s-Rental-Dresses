import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RotateCcw, X, ShoppingBag, Heart, Crown } from 'lucide-react';

interface ThinkerbellDialogueProps {
  onDismiss: () => void;
  onSelectCategory?: (category: 'all' | 'short' | 'long' | 'featured') => void;
}

export const ThinkerbellDialogue: React.FC<ThinkerbellDialogueProps> = ({
  onDismiss,
  onSelectCategory
}) => {
  const fullText = "Hello! I'm Thinkerbell. I'm here to assist you.";
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Smooth typewriter reveal effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleReplay = () => {
    let index = 0;
    setDisplayedText('');
    setIsTypingDone(false);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 40);
  };

  const handleCategoryClick = (cat: 'all' | 'short' | 'long' | 'featured') => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    onDismiss();
  };

  return (
    <div className="relative z-40 max-w-xl mx-auto w-full px-4 animate-fade-in select-none">
      {/* Outer Glow Halo */}
      <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/30 via-pink-500/20 to-amber-300/30 rounded-3xl blur-xl pointer-events-none" />

      {/* Main Glassmorphic Dialogue Card */}
      <div className="relative bg-[#0d121a]/90 backdrop-blur-xl border border-teal-400/50 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center text-white">
        {/* Floating Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Fairy Guide Dialogue</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          aria-label="Dismiss dialogue"
          title="Start shopping directly"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Thinkerbell Exact Dialogue */}
        <div className="min-h-[50px] flex items-center justify-center my-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-teal-100 tracking-wide drop-shadow">
            "{displayedText}"
            {!isTypingDone && (
              <span className="inline-block w-1.5 h-5 ml-1 bg-teal-400 animate-pulse align-middle" />
            )}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 font-light max-w-md mx-auto mt-2 leading-relaxed">
          Welcome to Lady's Rental! Where would you like to begin your dress fitting journey?
        </p>

        {/* Guided Quick-Access Category Buttons */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleCategoryClick('all')}
            className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold hover:border-teal-400 transition-all flex flex-col items-center gap-1 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-teal-300" />
            <span>All Dresses</span>
          </button>

          <button
            onClick={() => handleCategoryClick('short')}
            className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-pink-400/30 text-pink-200 text-xs font-semibold hover:border-pink-400 transition-all flex flex-col items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>Short Dresses</span>
          </button>

          <button
            onClick={() => handleCategoryClick('long')}
            className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-pink-400/30 text-pink-200 text-xs font-semibold hover:border-pink-400 transition-all flex flex-col items-center gap-1 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Long Dresses</span>
          </button>

          <button
            onClick={() => handleCategoryClick('featured')}
            className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold hover:border-amber-400 transition-all flex flex-col items-center gap-1 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-300" />
            <span>Featured Gowns</span>
          </button>
        </div>

        {/* Footer Actions: Continue & Replay */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleReplay}
            className="text-xs text-gray-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Replay dialogue typing"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onDismiss}
            className="px-6 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-teal-500 via-pink-600 to-rose-600 hover:from-teal-400 hover:to-rose-500 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Enter Dress Boutique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
