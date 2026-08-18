import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowRight, Shield, CreditCard, Sparkles, PlusCircle } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { VisaCard } from '../common/VisaCard';

export const IntroCardsScreen: React.FC = () => {
  const { accounts, setScreen, setSelectedAccount, currencySymbol } = useBanking();
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayAccounts = accounts.length > 0 ? accounts : [];
  const currentAccount = displayAccounts[currentIndex] || displayAccounts[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayAccounts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayAccounts.length) % displayAccounts.length);
  };

  const proceedToMainMenu = () => {
    if (currentAccount) {
      setSelectedAccount(currentAccount);
    }
    setScreen('main-menu');
  };

  return (
    <div
      id="intro-cards-screen"
      className="relative min-h-screen w-full bg-gradient-to-br from-[#6A0572] via-[#3a0d4c] to-[#1A1A2E] text-white flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#6A0572]/30 via-[#FFD700]/10 to-[#1A1A2E]/40 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#00ADB5]/15 blur-[100px] pointer-events-none" />

      {/* Top Bar / App Branding */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD700] to-[#F39C12] flex items-center justify-center shadow-lg shadow-[#FFD700]/25 border border-[#FFD700]/30">
            <span className="font-black text-sm tracking-tighter text-[#1A1A2E]">NB</span>
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm uppercase text-white">NEXAS BANK</span>
            <span className="block text-[10px] text-[#D9D9D9] font-mono">Digital Banking Suite</span>
          </div>
        </div>

        <button
          id="skip-to-main-menu-top"
          onClick={proceedToMainMenu}
          className="flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-[#00ADB5] to-[#393E46] hover:opacity-90 px-4 py-2 rounded-xl transition-all shadow-md font-semibold"
        >
          Enter Main Menu <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto py-8 flex flex-col items-center text-center">
        {/* Header & Motivational sub-text Requirement:
            Motivational header: “Manage Your Finances” (white text).
            Sub‑text: “Empower Your Money, Simplify Your Life” (light gray #D9D9D9).
        */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Smart Account Overview</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            Manage Your Finances
          </h1>

          <p className="mt-3 text-sm sm:text-lg text-[#D9D9D9] font-normal max-w-lg mx-auto">
            Empower Your Money, Simplify Your Life
          </p>
        </motion.div>

        {/* VISA Style Card Presentation Area */}
        <div className="relative mt-8 sm:mt-12 w-full flex flex-col items-center">
          {displayAccounts.length > 0 && currentAccount ? (
            <div className="relative w-full flex items-center justify-center">
              {/* Previous Card Button */}
              {displayAccounts.length > 1 && (
                <button
                  id="intro-prev-card-btn"
                  onClick={handlePrev}
                  className="hidden sm:flex absolute left-4 lg:left-12 z-20 w-11 h-11 rounded-xl bg-[#1A1A2E]/80 border border-white/10 items-center justify-center text-slate-300 hover:text-white hover:bg-[#393E46] hover:scale-105 transition-all shadow-lg"
                  aria-label="Previous Account"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Animated Card Swapper */}
              <div className="relative z-10 px-2 sm:px-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAccount.accountNumber}
                    initial={{ opacity: 0, scale: 0.92, rotateY: 10, y: 15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, rotateY: -10, y: -15 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="perspective-1000"
                  >
                    <VisaCard
                      account={currentAccount}
                      size="md"
                      isInteractive={true}
                      currencySymbol={currencySymbol}
                      onClick={proceedToMainMenu}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Card Button */}
              {displayAccounts.length > 1 && (
                <button
                  id="intro-next-card-btn"
                  onClick={handleNext}
                  className="hidden sm:flex absolute right-4 lg:right-12 z-20 w-11 h-11 rounded-xl bg-[#1A1A2E]/80 border border-white/10 items-center justify-center text-slate-300 hover:text-white hover:bg-[#393E46] hover:scale-105 transition-all shadow-lg"
                  aria-label="Next Account"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#1A1A2E] border border-white/10 text-center">
              <CreditCard className="w-10 h-10 text-[#00ADB5] mx-auto mb-2" />
              <p className="text-sm text-[#D9D9D9]">No registered accounts found.</p>
              <button
                onClick={() => setScreen('create-account')}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#00C853] to-[#64DD17] hover:opacity-90 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 mx-auto shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> Create First Account
              </button>
            </div>
          )}

          {/* Account Indicator Dots & Mobile Nav */}
          {displayAccounts.length > 1 && (
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={handlePrev}
                className="sm:hidden p-1.5 rounded-xl bg-[#1A1A2E] border border-white/10 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {displayAccounts.map((acc, idx) => (
                  <button
                    key={acc.accountNumber}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-7 bg-[#00ADB5]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`View account ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="sm:hidden p-1.5 rounded-xl bg-[#1A1A2E] border border-white/10 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Action Button Requirement: arrow icon, gradient teal (#00ADB5 → #393E46) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 sm:mt-10"
        >
          <button
            id="proceed-to-main-menu-btn"
            onClick={proceedToMainMenu}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#393E46] hover:from-[#00c5ce] hover:to-[#4a5059] text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#00ADB5]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-[#00ADB5]/30"
          >
            <span>Proceed to Main Menu</span>
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-[#D9D9D9]/70 pt-4 border-t border-white/10 font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00ADB5]" />
          <span>256-Bit Financial Security Active</span>
        </div>
        <div>
          <span>Account {currentIndex + 1} of {displayAccounts.length}</span>
        </div>
      </footer>
    </div>
  );
};
