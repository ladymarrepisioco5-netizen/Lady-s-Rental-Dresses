import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Landmark, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const SplashScreen2: React.FC = () => {
  const { setScreen } = useBanking();

  // Automatic zoom transition to screen 3 after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('intro-cards');
    }, 2400);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div
      id="splash-screen-2"
      onClick={() => setScreen('intro-cards')}
      className="relative min-h-screen w-full bg-gradient-to-br from-[#1B263B] via-[#1e425e] to-[#2C7DA0] text-white flex flex-col items-center justify-center cursor-pointer overflow-hidden px-4 select-none"
    >
      {/* Expanding Transition Rings */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.5, 3.8], opacity: [0.7, 0] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-72 h-72 rounded-full border border-[#2C7DA0]/60 pointer-events-none"
      />
      <motion.div
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [0.3, 4.8], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
        className="absolute w-80 h-80 rounded-full border border-[#FFD700]/40 pointer-events-none"
      />

      {/* Dynamic Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.4, 2.0],
          opacity: [0.3, 0.6, 0.2],
        }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
        className="absolute w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#2C7DA0]/40 via-[#FFD700]/20 to-[#1B263B]/40 blur-[120px] pointer-events-none"
      />

      {/* Zooming Logo Container */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{
          scale: [0.75, 1.15, 1.6],
          opacity: [0.2, 1, 0.95],
        }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex flex-col items-center"
      >
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-[#FFD700] via-[#2C7DA0] to-[#FFD700] p-1 shadow-2xl shadow-[#2C7DA0]/60 flex items-center justify-center">
          <div className="w-full h-full rounded-[22px] bg-[#1B263B] flex items-center justify-center border border-[#2C7DA0]/40">
            <Landmark className="w-16 h-16 sm:w-20 sm:h-20 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            NEXAS BANKING GATEWAY
          </div>
          <div className="text-xs text-[#64B5F6] font-mono mt-1 tracking-wider uppercase">
            Deep Blue → Teal Quantum Transition
          </div>
        </motion.div>
      </motion.div>

      {/* Skip button at top right */}
      <div className="absolute top-6 right-6 z-30">
        <button
          id="skip-splash-2-btn"
          onClick={(e) => {
            e.stopPropagation();
            setScreen('intro-cards');
          }}
          className="px-4 py-2 rounded-xl text-xs bg-[#0D1B2A]/80 backdrop-blur-md border border-[#2C7DA0]/40 text-slate-200 hover:text-white hover:bg-[#1B263B] transition-all flex items-center gap-1.5 shadow-lg"
        >
          Skip Intro <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
        </button>
      </div>
    </div>
  );
};
