import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { AppScreen } from '../../types/banking';
import { VisaCard } from '../common/VisaCard';
import {
  UserPlus,
  Search,
  ListOrdered,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  History,
  LogOut,
  TrendingUp,
  Wallet,
  Users,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Clock,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export const MainMenuHome: React.FC = () => {
  const {
    accounts,
    transactions,
    setScreen,
    selectedAccount,
    setSelectedAccount,
    currencySymbol,
  } = useBanking();

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAccounts = accounts.length;
  const recentTransactions = transactions.slice(0, 5);

  const activeCardAccount = selectedAccount || accounts[0];

  const menuOptions: {
    id: AppScreen;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    gradientClasses: string;
    badge?: string;
  }[] = [
    {
      id: 'create-account',
      title: 'Create Account',
      description: 'Open a new savings, checking, or business vault with custom initial deposit.',
      icon: UserPlus,
      gradientClasses: 'bg-gradient-to-r from-[#00C853] to-[#64DD17] text-white shadow-lg shadow-[#00C853]/25',
      badge: 'New',
    },
    {
      id: 'balance-inquiry',
      title: 'Balance Inquiry',
      description: 'Look up real-time account status, cardholder details, and current balance.',
      icon: Search,
      gradientClasses: 'bg-gradient-to-r from-[#2196F3] to-[#64B5F6] text-white shadow-lg shadow-[#2196F3]/25',
    },
    {
      id: 'list-accounts',
      title: 'List Accounts',
      description: `View complete ledger of all ${totalAccounts} registered bank accounts with search & export.`,
      icon: ListOrdered,
      gradientClasses: 'bg-gradient-to-r from-[#3F51B5] to-[#7986CB] text-white shadow-lg shadow-[#3F51B5]/25',
      badge: `${totalAccounts} Total`,
    },
    {
      id: 'deposit',
      title: 'Deposit',
      description: 'Credit funds directly into any registered account with immediate balance update.',
      icon: ArrowDownToLine,
      gradientClasses: 'bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white shadow-lg shadow-[#2E7D32]/25',
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      description: 'Debit cash or funds with strict overdraft and balance verification checks.',
      icon: ArrowUpFromLine,
      gradientClasses: 'bg-gradient-to-r from-[#F57C00] to-[#FFB74D] text-white shadow-lg shadow-[#F57C00]/25',
    },
    {
      id: 'transfer',
      title: 'Transfer',
      description: 'Instant peer-to-peer and account-to-account funds transfer with reference tracking.',
      icon: ArrowLeftRight,
      gradientClasses: 'bg-gradient-to-r from-[#8E24AA] to-[#BA68C8] text-white shadow-lg shadow-[#8E24AA]/25',
      badge: 'Instant',
    },
    {
      id: 'transaction-history',
      title: 'Transaction History',
      description: 'Audit full chronological records, transfer references, and balance audits.',
      icon: History,
      gradientClasses: 'bg-gradient-to-r from-[#455A64] to-[#90A4AE] text-white shadow-lg shadow-[#455A64]/25',
      badge: `${transactions.length} Logs`,
    },
    {
      id: 'exit',
      title: 'Exit',
      description: 'Safely lock banking session and return to splash screen or secure state.',
      icon: LogOut,
      gradientClasses: 'bg-gradient-to-r from-[#D32F2F] to-[#E57373] text-white shadow-lg shadow-[#D32F2F]/25',
    },
  ];

  return (
    <div id="main-menu-home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Overview: Header BANKING APPLICATION (bold white text on dark background #222831) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#222831] border border-neutral-700/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#00ADB5]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Headline & Metrics */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00ADB5]/15 border border-[#00ADB5]/30 text-[#00ADB5] text-[10px] font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#64DD17]" />
                Main Navigation Console
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                BANKING APPLICATION
              </h2>
              <p className="text-sm text-[#D9D9D9] mt-1.5 max-w-xl leading-relaxed">
                Choose from the 8 operational modules below to create accounts, query balances, process transactions, or inspect full ledger histories.
              </p>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#1A1A2E] border border-neutral-700">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <Users className="w-4 h-4 text-[#64B5F6]" />
                  <span className="text-[10px] font-bold text-[#D9D9D9]/70 uppercase tracking-widest">Total Accounts</span>
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-bold text-white font-mono">
                  {totalAccounts}
                </div>
                <span className="text-[10px] text-[#64DD17] flex items-center gap-0.5 mt-0.5 font-semibold">
                  <TrendingUp className="w-3 h-3" /> 100% Verified
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1A2E] border border-neutral-700">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <Wallet className="w-4 h-4 text-[#66BB6A]" />
                  <span className="text-[10px] font-bold text-[#D9D9D9]/70 uppercase tracking-widest">Total Liquidity</span>
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-bold text-[#64DD17] font-mono truncate">
                  {currencySymbol}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-[#D9D9D9]/60 mt-0.5 block font-mono">Total Vault Reserve</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#1A1A2E] border border-neutral-700">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                  <Clock className="w-4 h-4 text-[#FFB74D]" />
                  <span className="text-[10px] font-bold text-[#D9D9D9]/70 uppercase tracking-widest">Total Operations</span>
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-bold text-white font-mono">
                  {transactions.length}
                </div>
                <span className="text-[10px] text-[#D9D9D9]/60 mt-0.5 block font-mono">Audited Transactions</span>
              </div>
            </div>
          </div>

          {/* Right: Active VISA Card Highlight */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {activeCardAccount ? (
              <div className="w-full flex flex-col items-center">
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between w-full max-w-sm px-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#D9D9D9] uppercase tracking-widest">
                    <CreditCard className="w-3.5 h-3.5 text-[#00ADB5]" /> Active Card Preview
                  </span>
                  <button
                    onClick={() => setScreen('list-accounts')}
                    className="text-[#64B5F6] hover:text-[#2196F3] text-xs underline cursor-pointer font-medium"
                  >
                    View All
                  </button>
                </div>
                <VisaCard
                  account={activeCardAccount}
                  size="md"
                  currencySymbol={currencySymbol}
                  isInteractive={true}
                  onClick={() => setScreen('balance-inquiry')}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Menu Grid Navigation with Gradient Rectangular Buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Main Menu Navigation</h3>
            <p className="text-xs text-[#D9D9D9]">Click any rectangular gradient button to access that feature.</p>
          </div>
          <span className="text-xs font-semibold text-[#D9D9D9] bg-[#222831] px-3 py-1 rounded-full border border-neutral-700">
            8 Navigation Modules
          </span>
        </div>

        {/* 8 Feature Rectangular Gradient Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuOptions.map((opt, index) => {
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                id={`menu-card-${opt.id}`}
                onClick={() => setScreen(opt.id)}
                className={`group relative p-5 rounded-2xl ${opt.gradientClasses} transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] text-left border border-white/20`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {opt.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/25 text-white border border-white/20">
                          {opt.badge}
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-white/80">0{index + 1}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-white tracking-tight">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-white/90 mt-1.5 leading-relaxed line-clamp-2">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/25 flex items-center justify-between text-xs font-bold text-white">
                  <span>Open {opt.title}</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Ledger Activity Quick View */}
      <div className="rounded-2xl bg-[#222831] border border-neutral-700/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[#64B5F6]" />
            <h3 className="text-sm sm:text-base font-bold text-white">Recent Transactions</h3>
          </div>
          <button
            id="view-all-history-btn"
            onClick={() => setScreen('transaction-history')}
            className="text-xs text-[#64B5F6] hover:text-[#2196F3] font-semibold flex items-center gap-1"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-neutral-700/60 overflow-x-auto">
            {recentTransactions.map((txn) => {
              const isPositive =
                txn.type === 'Deposit' || txn.type === 'Transfer-In' || txn.type === 'Initial-Deposit';

              return (
                <div key={txn.id} className="py-3 flex items-center justify-between text-xs sm:text-sm hover:bg-neutral-800/40 px-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isPositive ? 'bg-emerald-500/20 text-[#64DD17]' : 'bg-rose-500/20 text-[#E57373]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                        {txn.description}
                      </div>
                      <div className="text-[11px] text-[#D9D9D9]/70 flex items-center gap-2 font-mono">
                        <span>{txn.id}</span>
                        <span>•</span>
                        <span>{txn.accountNumber}</span>
                        <span>•</span>
                        <span>{new Date(txn.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-bold ${
                        isPositive ? 'text-[#64DD17]' : 'text-[#E57373]'
                      }`}
                    >
                      {isPositive ? '+' : '-'}
                      {currencySymbol}
                      {txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] text-[#D9D9D9]/60 block font-mono">
                      Bal: {currencySymbol}{txn.balanceAfter.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">No transactions recorded yet.</div>
        )}
      </div>
    </div>
  );
};
