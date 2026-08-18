import React, { useState, useEffect } from 'react';
import { useBanking } from '../../context/BankingContext';
import { AppScreen } from '../../types/banking';
import {
  Landmark,
  UserPlus,
  Search,
  ListOrdered,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  History,
  LogOut,
  Sparkles,
  RefreshCw,
  CreditCard,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    accounts,
    selectedAccount,
    setSelectedAccount,
    resetAllData,
    currencySymbol,
    setCurrencySymbol,
  } = useBanking();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: AppScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'main-menu', label: 'Main Menu', icon: Landmark },
    { id: 'create-account', label: 'Create Account', icon: UserPlus },
    { id: 'balance-inquiry', label: 'Balance Inquiry', icon: Search },
    { id: 'list-accounts', label: 'List Accounts', icon: ListOrdered },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
    { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
    { id: 'transaction-history', label: 'Transaction History', icon: History },
    { id: 'exit', label: 'Exit', icon: LogOut },
  ];

  const handleNavClick = (screen: AppScreen) => {
    setScreen(screen);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-banking-header"
      className="sticky top-0 z-40 w-full bg-[#222831] border-b border-neutral-700/80 text-white shadow-md"
    >
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Main Title: BANKING APPLICATION */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setScreen('main-menu')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD700] to-[#F39C12] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
              <Landmark className="w-5 h-5 text-[#222831]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase font-sans">
                  BANKING APPLICATION
                </h1>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-[#00ADB5]/20 text-[#00ADB5] border border-[#00ADB5]/30 uppercase tracking-wider">
                  NEXAS
                </span>
              </div>
              <p className="text-[11px] text-[#D9D9D9]/70 tracking-tight font-medium">Empower Your Money, Simplify Your Life</p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Account Quick Select */}
            {accounts.length > 0 && (
              <div className="flex items-center bg-[#111827] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs shadow-inner">
                <CreditCard className="w-3.5 h-3.5 text-indigo-400 mr-2" />
                <span className="text-slate-400 mr-1.5 text-[11px] font-medium">Card:</span>
                <select
                  id="header-account-selector"
                  value={selectedAccount?.accountNumber || ''}
                  onChange={(e) => {
                    const acc = accounts.find((a) => a.accountNumber === e.target.value);
                    if (acc) setSelectedAccount(acc);
                  }}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="" className="bg-[#111827] text-slate-300">
                    -- Select Account --
                  </option>
                  {accounts.map((acc) => (
                    <option key={acc.accountNumber} value={acc.accountNumber} className="bg-[#111827] text-white">
                      {acc.accountHolder} ({acc.accountNumber.slice(-4)}) - {currencySymbol}{acc.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Currency Selector */}
            <div className="flex items-center bg-[#111827] border border-slate-700/80 rounded-xl p-0.5 text-xs font-semibold">
              {['$', '₱', '€', '£'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setCurrencySymbol(sym)}
                  className={`px-2.5 py-1 rounded-lg transition-colors text-xs ${
                    currencySymbol === sym ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* System Clock */}
            <div className="text-xs text-slate-400 font-mono bg-[#0B0E14] px-2.5 py-1.5 rounded-lg border border-slate-800">
              {timeStr}
            </div>

            {/* Intro Replay */}
            <button
              id="header-intro-replay-btn"
              onClick={() => setScreen('splash-1')}
              title="Replay Splash Screens"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">Showcase</span>
            </button>

            {/* Reset Demo Data */}
            <button
              id="header-reset-data-btn"
              onClick={() => {
                if (window.confirm('Reset all demo banking accounts and transactions to initial state?')) {
                  resetAllData();
                }
              }}
              title="Reset Sample Data"
              className="text-xs text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Exit button */}
            <button
              id="header-exit-btn"
              onClick={() => setScreen('exit')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-slate-700/60 text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links Bar (Desktop) */}
      <div className="hidden lg:block bg-[#111827] border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-start space-x-1.5 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            const isExit = item.id === 'exit';

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-600/30 font-semibold'
                    : isExit
                    ? 'text-slate-400 hover:bg-red-900/20 hover:text-red-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-slate-600'}`} />
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#111827] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              const isExit = item.id === 'exit';

              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-md'
                      : isExit
                      ? 'bg-red-950/30 text-red-300 border border-red-900/40'
                      : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Currency:</span>
            <div className="flex space-x-1">
              {['$', '₱', '€', '£'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setCurrencySymbol(sym)}
                  className={`px-2 py-1 rounded text-xs ${
                    currencySymbol === sym ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
