import React from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Lock,
  RotateCcw,
  Landmark,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const ExitScreen: React.FC = () => {
  const { setScreen, resetAllData, accounts, transactions, currencySymbol } = useBanking();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div
      id="exit-screen"
      className="min-h-screen w-full bg-[#0B0E14] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#111827] border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        {/* Lock Icon Emblem */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-950/40">
          <Lock className="w-10 h-10 text-indigo-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Session Safely Locked</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Thank you for using Nexus Banking Application. Your active session credentials have been locked.
          </p>
        </div>

        {/* Session Recap Metrics */}
        <div className="bg-[#0B0E14] rounded-2xl p-4 border border-slate-800 grid grid-cols-2 gap-3 text-left">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Registered Accounts</span>
            <span className="text-base font-mono font-bold text-white">{accounts.length} Active</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Total Vault Liquidity</span>
            <span className="text-base font-mono font-bold text-emerald-400">
              {currencySymbol}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted local session state preserved</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          {/* Re-enter App / Main Menu */}
          <button
            id="re-enter-app-btn"
            onClick={() => setScreen('main-menu')}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Landmark className="w-4 h-4" />
            <span>Re-Enter Main Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Replay Intro Splash Flow */}
          <button
            id="restart-intro-btn"
            onClick={() => setScreen('splash-1')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Replay Intro Splash Screens</span>
          </button>

          {/* Reset All Sample Data */}
          <button
            id="reset-demo-data-btn"
            onClick={() => {
              if (window.confirm('Reset all demo banking accounts and transactions to initial state?')) {
                resetAllData();
                setScreen('splash-1');
              }
            }}
            className="w-full py-2 text-[11px] text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Bank to Factory State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
