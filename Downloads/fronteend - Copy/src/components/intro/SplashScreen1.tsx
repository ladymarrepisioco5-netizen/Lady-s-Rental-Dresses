import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Landmark, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const SplashScreen1: React.FC = () => {
  const { setScreen } = useBanking();

  // Automatic advance after 2.8 seconds or on click
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('splash-2');
    }, 2800);
    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div
      id="splash-screen-1"
      onClick={() => setScreen('splash-2')}
      className="relative min-h-screen w-full bg-[#0D1B2A] text-white flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none px-4"
    >
      {/* Glowing gold & deep navy background ambient lighting */}
      <div className="absolute w-[30rem] h-[30rem] rounded-full bg-[#FFD700]/10 blur-[130px] pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-[#2C7DA0]/15 blur-[100px] pointer-events-none -bottom-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Glowing NEXAS BANK Logo Icon with Gold Accent #FFD700 */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-[#FFD700]/30 border-dashed"
          />
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#FFD700] via-[#F39C12] to-[#FFD700] p-1 shadow-2xl shadow-[#FFD700]/30 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[22px] bg-[#0D1B2A] flex items-center justify-center border border-[#FFD700]/40">
              <Landmark className="w-12 h-12 sm:w-14 sm:h-14 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
            </div>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-[#FFD700] p-1.5 rounded-full shadow-lg shadow-[#FFD700]/40">
            <Shield className="w-4 h-4 text-[#0D1B2A] font-bold" />
          </div>
        </div>

        {/* Bank Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans"
        >
          NEXAS <span className="text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]">BANK</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-2 text-xs sm:text-sm text-slate-300 tracking-widest uppercase font-medium flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
          Secure Digital Banking Gateway
        </motion.p>

        {/* Progress indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '130px' }}
          transition={{ delay: 0.6, duration: 2.0, ease: 'easeInOut' }}
          className="h-1 bg-gradient-to-r from-[#FFD700] to-[#2C7DA0] rounded-full mt-8 shadow-sm shadow-[#FFD700]/50"
        />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-4 text-[11px] text-slate-400 flex items-center gap-1 hover:text-white transition-colors"
        >
          Click anywhere to continue <ArrowRight className="w-3 h-3 text-[#FFD700]" />
        </motion.span>
      </motion.div>
    </div>
  );
};
