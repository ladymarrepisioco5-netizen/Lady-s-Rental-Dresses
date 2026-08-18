import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount } from '../../types/banking';
import { VisaCard } from '../common/VisaCard';
import {
  Search,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ArrowLeft
} from 'lucide-react';

export const BalanceInquiryPage: React.FC = () => {
  const { checkBalance, accounts, setScreen, setSelectedAccount, currencySymbol } = useBanking();

  const [inputAccountNumber, setInputAccountNumber] = useState('');
  const [inquiredAccount, setInquiredAccount] = useState<BankAccount | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCheckBalance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setInquiredAccount(null);
    setHasSearched(true);

    if (!inputAccountNumber.trim()) {
      setErrorMsg('Please enter an account number.');
      return;
    }

    const result = checkBalance(inputAccountNumber.trim());
    if (result.success && result.account) {
      setInquiredAccount(result.account);
      setSelectedAccount(result.account);
    } else {
      setErrorMsg(result.error || 'Account not found.');
    }
  };

  const handleSelectQuickAccount = (acc: BankAccount) => {
    setInputAccountNumber(acc.accountNumber);
    setInquiredAccount(acc);
    setSelectedAccount(acc);
    setErrorMsg(null);
    setHasSearched(true);
  };

  return (
    <div id="balance-inquiry-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('main-menu')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
        </button>
        <span className="text-xs text-neutral-500 font-mono">Module 02 • Real-time Inquiry</span>
      </div>

      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Balance Inquiry</h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Query real-time account holdings, cardholder identities, and active liquidity balances.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Select Pill Buttons */}
      {accounts.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-neutral-400 font-medium">Quick Pick Registered Account:</span>
          <div className="flex flex-wrap gap-2">
            {accounts.slice(0, 5).map((acc) => (
              <button
                key={acc.accountNumber}
                type="button"
                onClick={() => handleSelectQuickAccount(acc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                  inputAccountNumber === acc.accountNumber
                    ? 'bg-purple-900/60 border-purple-400 text-purple-200'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <CreditCard className="w-3 h-3 text-purple-400" />
                <span>{acc.accountHolder} ({acc.accountNumber.slice(-4)})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Query Card */}
      <form
        onSubmit={handleCheckBalance}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4"
      >
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300">
            Account Number <span className="text-rose-400">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="inquiry-account-number-input"
                type="text"
                value={inputAccountNumber}
                onChange={(e) => {
                  setInputAccountNumber(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Enter Account Number (e.g. ACC-8834-1029)"
                required
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              id="check-balance-btn"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Check Balance</span>
            </button>
          </div>
        </div>
      </form>

      {/* Error State: Account not found */}
      {errorMsg && (
        <div
          id="inquiry-error-banner"
          className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-200">{errorMsg}</div>
            <p className="text-xs text-rose-300/80 mt-0.5">
              Please double check the entered account number or check the{' '}
              <button
                onClick={() => setScreen('list-accounts')}
                className="underline text-white font-semibold"
              >
                List Accounts
              </button>{' '}
              directory.
            </p>
          </div>
        </div>
      )}

      {/* Success Output Details Display */}
      {inquiredAccount && !errorMsg && (
        <div
          id="balance-inquiry-output-card"
          className="bg-neutral-900 border border-purple-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>Inquiry Match Found</span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Timestamp: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Output Details Spec: Account Number, Holder Name, Current Balance */}
            <div className="space-y-4 bg-neutral-950/80 rounded-xl p-5 border border-neutral-800">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Account Number
                </span>
                <span className="text-base font-mono font-bold text-white">
                  {inquiredAccount.accountNumber}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Account Holder Name
                </span>
                <span className="text-lg font-bold text-white">
                  {inquiredAccount.accountHolder}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Current Balance
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400">
                  {currencySymbol}
                  {inquiredAccount.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                <span>Account Type: <strong className="text-white">{inquiredAccount.accountType}</strong></span>
                <span>Status: <strong className="text-emerald-400">{inquiredAccount.status}</strong></span>
              </div>
            </div>

            {/* Visual Card */}
            <div className="flex justify-center">
              <VisaCard
                account={inquiredAccount}
                size="sm"
                currencySymbol={currencySymbol}
              />
            </div>
          </div>

          {/* Quick Actions for this Account */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs text-neutral-400 font-medium mr-1">Direct Actions:</span>
            <button
              onClick={() => {
                setSelectedAccount(inquiredAccount);
                setScreen('deposit');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600/20 border border-teal-500/30 text-teal-300 hover:bg-teal-600 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" /> Deposit
            </button>
            <button
              onClick={() => {
                setSelectedAccount(inquiredAccount);
                setScreen('withdraw');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <ArrowUpFromLine className="w-3.5 h-3.5" /> Withdraw
            </button>
            <button
              onClick={() => {
                setSelectedAccount(inquiredAccount);
                setScreen('transfer');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer
            </button>
            <button
              onClick={() => {
                setSelectedAccount(inquiredAccount);
                setScreen('transaction-history');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1 transition-all ml-auto"
            >
              <span>Ledger History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
