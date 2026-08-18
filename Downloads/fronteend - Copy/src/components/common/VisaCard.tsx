import React from 'react';
import { BankAccount } from '../../types/banking';
import { Wifi, Sparkles, ShieldCheck } from 'lucide-react';

interface VisaCardProps {
  account: BankAccount;
  maskedNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  onClick?: () => void;
  currencySymbol?: string;
}

export const VisaCard: React.FC<VisaCardProps> = ({
  account,
  size = 'md',
  isInteractive = false,
  onClick,
  currencySymbol = '$',
}) => {
  // Format partial / masked account number
  const formatMasked = (num: string) => {
    const clean = num.replace(/[^A-Za-z0-9]/g, '');
    const last4 = clean.slice(-4) || '1029';
    return `•••• •••• ${last4}`;
  };

  const getGradientByTheme = (theme: string) => {
    switch (theme) {
      case 'royal':
        return 'bg-[#0F4C75] border-blue-400/20 text-white shadow-xl shadow-[#0F4C75]/40';
      case 'violet':
      case 'indigo':
        return 'from-indigo-900 via-purple-900 to-slate-900 border-white/10 text-white shadow-indigo-950/60';
      case 'ocean':
        return 'bg-gradient-to-tr from-[#0F4C75] via-[#1B263B] to-[#0D1B2A] border-blue-400/20 text-white shadow-xl shadow-[#0F4C75]/40';
      case 'emerald':
        return 'from-emerald-950 via-teal-900 to-slate-950 border-white/10 text-white shadow-emerald-950/60';
      case 'rose':
        return 'from-rose-950 via-purple-950 to-slate-950 border-white/10 text-white shadow-rose-950/60';
      case 'amber':
        return 'from-amber-950 via-stone-900 to-slate-950 border-white/10 text-white shadow-amber-950/60';
      case 'slate':
      default:
        return 'from-slate-900 via-slate-800 to-indigo-950 border-white/10 text-white shadow-slate-950/60';
    }
  };

  const sizeClasses = {
    sm: 'w-72 h-44 p-4 text-xs',
    md: 'w-84 sm:w-96 h-52 sm:h-56 p-6 text-sm',
    lg: 'w-full max-w-md h-60 p-7 text-base',
  }[size];

  return (
    <div
      id={`visa-card-${account.accountNumber}`}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-tr border shadow-2xl backdrop-blur-md transition-all duration-300 select-none ${getGradientByTheme(
        account.cardColor
      )} ${sizeClasses} ${
        isInteractive ? 'cursor-pointer hover:scale-[1.02] hover:shadow-cyan-500/20 active:scale-[0.98]' : ''
      }`}
    >
      {/* Background Decorative patterns */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />

      {/* Top Row: Bank Brand & Contactless Chip */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-300 to-yellow-500 flex items-center justify-center shadow-md">
            <span className="font-extrabold text-neutral-900 text-xs tracking-tighter">NX</span>
          </div>
          <div>
            <div className="font-bold tracking-wider text-xs uppercase text-white/90">NEXUS BANK</div>
            <div className="text-[10px] text-white/50 tracking-widest uppercase">{account.accountType} Platinum</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-white/70">
          <Wifi className="w-5 h-5 rotate-90" />
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Middle Row: Smart Chip & Balance Peek */}
      <div className="relative z-10 mt-5 flex items-center justify-between">
        <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border border-amber-200/50 shadow-inner flex items-center justify-around px-1">
          <div className="w-2 h-4 border-r border-amber-800/40" />
          <div className="w-3 h-3 rounded-full border border-amber-800/30" />
          <div className="w-2 h-4 border-l border-amber-800/40" />
        </div>

        <div className="text-right">
          <span className="text-[10px] text-white/60 uppercase tracking-wider block">Current Balance</span>
          <span className="font-mono font-bold text-lg sm:text-xl text-white tracking-tight">
            {currencySymbol}{account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Masked Card Number */}
      <div className="relative z-10 mt-4 sm:mt-5 font-mono tracking-widest text-base sm:text-lg text-white/90 drop-shadow-md">
        {formatMasked(account.accountNumber)}
      </div>

      {/* Bottom Row: Card Holder & Visa Logo */}
      <div className="relative z-10 mt-3 sm:mt-4 flex items-end justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">Card Holder</div>
          <div className="font-semibold text-white tracking-wide text-xs sm:text-sm uppercase truncate max-w-[190px]">
            {account.accountHolder}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="italic font-black text-xl sm:text-2xl tracking-tighter text-white/90 drop-shadow">
            VISA
          </div>
          <span className="text-[8px] uppercase tracking-wider text-white/60 -mt-1">Debit</span>
        </div>
      </div>
    </div>
  );
};
