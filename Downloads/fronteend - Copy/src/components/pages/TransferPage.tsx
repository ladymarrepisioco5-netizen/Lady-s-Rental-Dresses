
import { transfer } from "./api";
import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount } from '../../types/banking';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Receipt,
  Sparkles,
  ArrowDown
} from 'lucide-react';

export const TransferPage: React.FC = () => {
  const { transfer, accounts, selectedAccount, setSelectedAccount, setScreen, currencySymbol } = useBanking();

  const [sourceAccount, setSourceAccount] = useState(selectedAccount?.accountNumber || '');
  const [destAccount, setDestAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [memo, setMemo] = useState('');

  const [transferResult, setTransferResult] = useState<{
    fromAccount: string;
    toAccount: string;
    amount: number;
    sourcePrevBalance?: number;
    sourceNewBalance?: number;
    destPrevBalance?: number;
    destNewBalance?: number;
    sourceAccountObj?: BankAccount;
    destAccountObj?: BankAccount;
    transactionId?: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const srcAccObj = accounts.find((a) => a.accountNumber === sourceAccount);
  const dstAccObj = accounts.find((a) => a.accountNumber === destAccount);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setTransferResult(null);

    const amountNum = parseFloat(transferAmount);
    if (!sourceAccount.trim()) {
      setErrorMsg('Please select or input a Source Account.');
      return;
    }
    if (!destAccount.trim()) {
      setErrorMsg('Please select or input a Destination Account.');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Transfer amount must be greater than 0.');
      return;
    }

    const res = transfer(sourceAccount.trim(), destAccount.trim(), amountNum, memo.trim() || undefined);

    if (res.success) {
      setTransferResult({
        fromAccount: res.fromAccount,
        toAccount: res.toAccount,
        amount: res.amount,
        sourcePrevBalance: res.sourcePrevBalance,
        sourceNewBalance: res.sourceNewBalance,
        destPrevBalance: res.destPrevBalance,
        destNewBalance: res.destNewBalance,
        sourceAccountObj: res.sourceAccountObj,
        destAccountObj: res.destAccountObj,
        transactionId: res.transactionId,
      });
      if (res.sourceAccountObj) {
        setSelectedAccount(res.sourceAccountObj);
      }
      setTransferAmount('');
      setMemo('');
    } else {
      setErrorMsg(res.error || 'Transfer failed.');
    }
  };

  return (
    <div id="transfer-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('main-menu')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
        </button>
        <span className="text-xs text-neutral-500 font-mono">Module 06 • P2P & Inter-Account Transfer</span>
      </div>

      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Transfer Money</h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Transfer funds between accounts with instant settlement, balance recalculation, and dual transaction logs.
            </p>
          </div>
        </div>
      </div>

      {/* Output / Receipt Requirements: From Account, To Account, Amount, Success Message */}
      {transferResult && (
        <div
          id="transfer-output-card"
          className="bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-indigo-900/40">
            <div className="flex items-center space-x-2 text-indigo-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">Transfer Completed Successfully!</h3>
                <p className="text-xs text-indigo-300">Funds were instantly cleared and debited/credited.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-indigo-300">
              Ref: {transferResult.transactionId}
            </span>
          </div>

          {/* Required Output Grid: From Account, To Account, Amount, Success Message */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Account */}
            <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 space-y-1">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">
                From Account (Debited)
              </span>
              <div className="font-mono font-bold text-white text-sm">
                {transferResult.fromAccount}
              </div>
              <div className="text-xs font-semibold text-neutral-300">
                {transferResult.sourceAccountObj?.accountHolder}
              </div>
              {transferResult.sourceNewBalance !== undefined && (
                <div className="text-[11px] text-neutral-400 pt-1 font-mono">
                  Remaining Bal: <strong className="text-white">{currencySymbol}{transferResult.sourceNewBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
            </div>

            {/* Transfer Amount Highlight */}
            <div className="bg-neutral-950/80 rounded-xl p-4 border border-indigo-500/30 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[11px] text-indigo-300 uppercase tracking-wider block font-semibold">
                Transfer Amount
              </span>
              <div className="text-2xl font-mono font-extrabold text-indigo-400">
                {currencySymbol}
                {transferResult.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3" /> Zero Fee Instant Clearing
              </span>
            </div>

            {/* To Account */}
            <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 space-y-1">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">
                To Account (Credited)
              </span>
              <div className="font-mono font-bold text-white text-sm">
                {transferResult.toAccount}
              </div>
              <div className="text-xs font-semibold text-neutral-300">
                {transferResult.destAccountObj?.accountHolder}
              </div>
              {transferResult.destNewBalance !== undefined && (
                <div className="text-[11px] text-neutral-400 pt-1 font-mono">
                  Updated Bal: <strong className="text-emerald-400">{currencySymbol}{transferResult.destNewBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setScreen('transaction-history')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>View in Transaction History</span>
            </button>
            <button
              onClick={() => setTransferResult(null)}
              className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
            >
              Send Another Transfer
            </button>
          </div>
        </div>
      )}

      {/* Transfer Form */}
      <form
        onSubmit={handleTransferSubmit}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        {/* Error Requirement: "Invalid Account" / "Insufficient Balance." */}
        {errorMsg && (
          <div
            id="transfer-error-banner"
            className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="font-semibold text-rose-200">{errorMsg}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Account */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Source Account (From) <span className="text-rose-400">*</span>
            </label>
            <div className="space-y-1.5">
              <select
                id="transfer-source-select"
                value={sourceAccount}
                onChange={(e) => setSourceAccount(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-neutral-400">-- Select Source Account --</option>
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber} className="bg-neutral-900 text-white">
                    {acc.accountHolder} ({acc.accountNumber}) - Bal: {currencySymbol}{acc.balance.toLocaleString()}
                  </option>
                ))}
              </select>
              <input
                id="transfer-source-input"
                type="text"
                value={sourceAccount}
                onChange={(e) => setSourceAccount(e.target.value)}
                placeholder="Or type Source Account #..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {srcAccObj && (
              <p className="text-[11px] text-neutral-400">
                Cardholder: <strong className="text-white">{srcAccObj.accountHolder}</strong> • Available:{' '}
                <strong className="text-emerald-400">{currencySymbol}{srcAccObj.balance.toLocaleString()}</strong>
              </p>
            )}
          </div>

          {/* Destination Account */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Destination Account (To) <span className="text-rose-400">*</span>
            </label>
            <div className="space-y-1.5">
              <select
                id="transfer-dest-select"
                value={destAccount}
                onChange={(e) => setDestAccount(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-neutral-400">-- Select Destination Account --</option>
                {accounts
                  .filter((a) => a.accountNumber !== sourceAccount)
                  .map((acc) => (
                    <option key={acc.accountNumber} value={acc.accountNumber} className="bg-neutral-900 text-white">
                      {acc.accountHolder} ({acc.accountNumber})
                    </option>
                  ))}
              </select>
              <input
                id="1"
                type="tranfer"
                value={200000}
                onChange={(e) => setDestAccount(e.target.value)}
                placeholder="Or type Destination Account #..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {dstAccObj && (
              <p className="text-[11px] text-neutral-400">
                Recipient: <strong className="text-white">{dstAccObj.accountHolder}</strong> ({dstAccObj.accountType})
              </p>
            )}
          </div>
        </div>

        {/* Transfer Amount */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300">
            Transfer Amount ({currencySymbol}) <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold font-mono">
              {currencySymbol}
            </span>
            <input
              id="transfer-amount-input"
              type="number"
              min="0.01"
              step="0.01"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Transfer Memo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300">
            Transfer Purpose / Memo (Optional)
          </label>
          <input
            id="transfer-memo-input"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="e.g. Rent share, dinner bill, invoice payment"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
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
            id="transfer-submit-btn"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer Funds</span>
          </button>
        </div>
      </form>
    </div>
  );
};
