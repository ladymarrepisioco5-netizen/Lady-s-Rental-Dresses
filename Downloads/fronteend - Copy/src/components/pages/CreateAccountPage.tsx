import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { AccountType, CardColorTheme, BankAccount } from '../../types/banking';
import { VisaCard } from '../common/VisaCard';
import {
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Dices,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Building2,
  Wallet,
  ArrowLeft
} from 'lucide-react';

export const CreateAccountPage: React.FC = () => {
  const {
    createAccount,
    generateUniqueAccountNumber,
    setScreen,
    setSelectedAccount,
    currencySymbol,
  } = useBanking();

  const [accountNumber, setAccountNumber] = useState(() => generateUniqueAccountNumber());
  const [accountHolder, setAccountHolder] = useState('');
  const [initialDeposit, setInitialDeposit] = useState<string>('1000');
  const [accountType, setAccountType] = useState<AccountType>('Savings');
  const [cardColor, setCardColor] = useState<CardColorTheme>('violet');

  const [createdAccount, setCreatedAccount] = useState<BankAccount | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAutoGenerate = () => {
    setAccountNumber(generateUniqueAccountNumber());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const depositVal = parseFloat(initialDeposit) || 0;
    if (!accountNumber.trim()) {
      setErrorMsg('Please enter or generate an Account Number.');
      return;
    }
    if (!accountHolder.trim()) {
      setErrorMsg('Please enter the Account Holder Name.');
      return;
    }
    if (depositVal < 0) {
      setErrorMsg('Initial deposit cannot be negative.');
      return;
    }

    const res = createAccount({
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
      initialDeposit: depositVal,
      accountType,
      cardColor,
    });

    if (res.success && res.account) {
      setCreatedAccount(res.account);
      setSelectedAccount(res.account);
      setSuccessMsg(`Account successfully registered! Your ${accountType} account is active with ${currencySymbol}${depositVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  const handleResetForm = () => {
    setAccountNumber(generateUniqueAccountNumber());
    setAccountHolder('');
    setInitialDeposit('1000');
    setAccountType('Savings');
    setCardColor('violet');
    setCreatedAccount(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div id="create-account-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb / Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('main-menu')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
        </button>
        <span className="text-xs text-neutral-500 font-mono">Module 01 • Account Provisioning</span>
      </div>

      {/* Header */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Fill in the account credentials below to generate a new verified bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Output / Success State */}
      {createdAccount && successMsg && (
        <div
          id="create-account-output-card"
          className="bg-gradient-to-br from-emerald-950/40 via-[#111827] to-[#111827] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-300"
        >
          <div className="flex items-center space-x-3 text-emerald-400">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">Account Created Successfully!</h3>
              <p className="text-xs text-emerald-300/90">{successMsg}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Account Details Box */}
            <div className="space-y-3 bg-[#0B0E14] rounded-xl p-4 border border-slate-800 text-xs">
              <div className="font-bold text-slate-400 uppercase tracking-widest text-[10px] pb-2 border-b border-slate-800">
                Official Account Details
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-mono font-bold text-white">{createdAccount.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account Holder:</span>
                <span className="font-semibold text-white">{createdAccount.accountHolder}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account Type:</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-medium">
                  {createdAccount.accountType}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Initial Deposit:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currencySymbol}{createdAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                </span>
              </div>
            </div>

            {/* Issued Visa Card Preview */}
            <div className="flex justify-center">
              <VisaCard
                account={createdAccount}
                size="sm"
                currencySymbol={currencySymbol}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="view-in-accounts-btn"
              onClick={() => setScreen('list-accounts')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-500/20"
            >
              <span>View in All Accounts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="make-deposit-btn"
              onClick={() => setScreen('deposit')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deposit Funds</span>
            </button>
            <button
              id="create-another-account-btn"
              onClick={handleResetForm}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              + Create Another Account
            </button>
          </div>
        </div>
      )}

      {/* Account Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Account Number <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="account-number-input"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. ACC-1001-2030"
                required
                className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                id="auto-generate-acc-btn"
                onClick={handleAutoGenerate}
                title="Auto Generate Unique Account Number"
                className="px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
              >
                <Dices className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">Unique alphanumeric identification string.</p>
          </div>

          {/* Account Holder Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Account Holder Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="account-holder-input"
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="e.g. Maria Santos / Johnathan Doe"
              required
              className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500">Full legal name of the primary cardholder.</p>
          </div>

          {/* Initial Deposit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Initial Deposit ({currencySymbol}) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                {currencySymbol}
              </span>
              <input
                id="initial-deposit-input"
                type="number"
                min="0"
                step="0.01"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500">Opening balance to credit into vault ledger.</p>
          </div>

          {/* Account Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Account Classification</label>
            <select
              id="account-type-select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
              className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="Savings">Savings Account (Standard APY)</option>
              <option value="Checking">Checking Account (Debit & BillPay)</option>
              <option value="Business">Business Account (Commercial Vault)</option>
              <option value="Investment">Investment Portfolio Account</option>
            </select>
            <p className="text-[11px] text-slate-500">Defines overdraft privileges and tier benefits.</p>
          </div>
        </div>

        {/* Card Theme Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300">Card Hologram Gradient Theme</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(
              [
                { id: 'violet', label: 'Indigo', bg: 'bg-indigo-600' },
                { id: 'ocean', label: 'Ocean', bg: 'bg-blue-600' },
                { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
                { id: 'rose', label: 'Rose', bg: 'bg-rose-600' },
                { id: 'amber', label: 'Amber', bg: 'bg-amber-600' },
                { id: 'slate', label: 'Obsidian', bg: 'bg-slate-700' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCardColor(c.id)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  cardColor === c.id
                    ? 'border-indigo-500 bg-slate-800 text-white shadow-md'
                    : 'border-slate-800 bg-[#0B0E14] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${c.bg}`} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => setScreen('main-menu')}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="create-account-submit-btn"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>
      </form>
    </div>
  );
};
