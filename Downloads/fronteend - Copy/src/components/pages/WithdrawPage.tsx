import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount, Transaction } from '../../types/banking';
import {
  ArrowUpFromLine,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Receipt
} from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const { withdraw, accounts, selectedAccount, setSelectedAccount, setScreen, currencySymbol } = useBanking();

  const [accountNumber, setAccountNumber] = useState(selectedAccount?.accountNumber || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [note, setNote] = useState('');

  const [withdrawResult, setWithdrawResult] = useState<{
    prevBalance: number;
    withdrawAmount: number;
    newBalance: number;
    account?: BankAccount;
    transaction?: Transaction;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const targetAccount = accounts.find((a) => a.accountNumber === accountNumber);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setWithdrawResult(null);

    const amountNum = parseFloat(withdrawAmount);
    if (!accountNumber.trim()) {
      setErrorMsg('Please select or input an Account Number.');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Withdrawal amount must be greater than 0.');
      return;
    }

    const res = withdraw(accountNumber.trim(), amountNum, note.trim() || undefined);

    if (res.success) {
      setWithdrawResult({
        prevBalance: res.prevBalance,
        withdrawAmount: res.withdrawAmount,
        newBalance: res.newBalance,
        account: res.account,
        transaction: res.transaction,
      });
      if (res.account) {
        setSelectedAccount(res.account);
      }
      setWithdrawAmount('');
      setNote('');
    } else {
      setErrorMsg(res.error || 'Withdrawal failed.');
    }
  };

  const handleSelectAccount = (acc: BankAccount) => {
    setAccountNumber(acc.accountNumber);
    setSelectedAccount(acc);
    setErrorMsg(null);
  };

  return (
    <div id="withdraw-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('main-menu')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
        </button>
        <span className="text-xs text-neutral-500 font-mono">Module 05 • Cash Withdrawal</span>
      </div>

      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ArrowUpFromLine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Withdraw Funds</h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Debit funds from account with real-time liquidity and overdraft checks.
            </p>
          </div>
        </div>
      </div>

      {/* Output / Receipt Requirements: Previous Balance, Withdrawal Amount, New Balance */}
      {withdrawResult && (
        <div
          id="withdraw-output-card"
          className="bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
            <div className="flex items-center space-x-2 text-amber-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Withdrawal Successful</h3>
            </div>
            <span className="text-xs font-mono text-amber-300">
              Ref: {withdrawResult.transaction?.id}
            </span>
          </div>

          {/* Core Required Output Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                Previous Balance
              </span>
              <span className="text-lg sm:text-xl font-mono font-bold text-neutral-300">
                {currencySymbol}
                {withdrawResult.prevBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="bg-neutral-950/80 rounded-xl p-4 border border-amber-500/30">
              <span className="text-[11px] text-amber-300 uppercase tracking-wider block font-semibold">
                Withdrawal Amount
              </span>
              <span className="text-lg sm:text-xl font-mono font-bold text-amber-400">
                -{currencySymbol}
                {withdrawResult.withdrawAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-700">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-semibold">
                New Balance
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                {currencySymbol}
                {withdrawResult.newBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800 flex justify-between">
            <span>
              Debited Account: <strong>{withdrawResult.account?.accountHolder}</strong> ({withdrawResult.account?.accountNumber})
            </span>
            <span className="text-neutral-400">{new Date().toLocaleString()}</span>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setScreen('transaction-history')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>View in Transaction History</span>
            </button>
            <button
              onClick={() => setWithdrawResult(null)}
              className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
            >
              Perform Another Withdrawal
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Form */}
      <form
        onSubmit={handleWithdrawSubmit}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        {/* Error Requirement: "Insufficient Balance." / "Account not found." */}
        {errorMsg && (
          <div
            id="withdraw-error-banner"
            className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="font-semibold text-rose-200">{errorMsg}</div>
          </div>
        )}

        {/* Quick Pick Account */}
        {accounts.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-400">
              Select Source Account to Debit:
            </label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.accountNumber}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                    accountNumber === acc.accountNumber
                      ? 'bg-amber-950 border-amber-500 text-amber-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {acc.accountHolder} ({acc.accountNumber.slice(-4)}) - {currencySymbol}{acc.balance.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Account Number <span className="text-rose-400">*</span>
            </label>
            <input
              id="withdraw-account-number-input"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. ACC-8834-1029"
              required
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {targetAccount && (
              <p className="text-[11px] text-emerald-400 font-mono">
                Available to withdraw: {currencySymbol}{targetAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Withdrawal Amount ({currencySymbol}) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold font-mono">
                {currencySymbol}
              </span>
              <input
                id="withdraw-amount-input"
                type="number"
                min="0.01"
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-neutral-500">Amount to debit from current balance.</p>
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="space-y-1.5">
          <label className="block text-xs text-neutral-400">Quick Withdrawal Presets:</label>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 500, 1000, 2000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setWithdrawAmount(preset.toString())}
                className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-amber-300 transition-colors"
              >
                -{currencySymbol}{preset}
              </button>
            ))}
            {targetAccount && targetAccount.balance > 0 && (
              <button
                type="button"
                onClick={() => setWithdrawAmount(targetAccount.balance.toString())}
                className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 text-xs font-mono text-amber-200 transition-colors"
              >
                Max ({currencySymbol}{targetAccount.balance.toLocaleString()})
              </button>
            )}
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300">Withdrawal Reason / Memo (Optional)</label>
          <input
            id="withdraw-note-input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. ATM Cash Out, Branch Withdrawal, Living Expenses"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => setScreen('main-menu')}
            className="px-5 py-2.5 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="withdraw-submit-btn"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </form>
    </div>
  );
};
