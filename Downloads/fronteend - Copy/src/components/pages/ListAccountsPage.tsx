import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount } from '../../types/banking';
import {
  ListOrdered,
  Search,
  UserPlus,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  History,
  ArrowLeft,
  Filter,
  CheckCircle2,
  Wallet
} from 'lucide-react';

export const ListAccountsPage: React.FC = () => {
  const { accounts, setScreen, setSelectedAccount, currencySymbol } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountHolder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || acc.accountType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalAccounts = accounts.length;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAction = (acc: BankAccount, targetScreen: 'deposit' | 'withdraw' | 'transfer' | 'transaction-history' | 'balance-inquiry') => {
    setSelectedAccount(acc);
    setScreen(targetScreen);
  };

  return (
    <div id="list-accounts-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('main-menu')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
        </button>
        <span className="text-xs text-neutral-500 font-mono">Module 03 • Accounts Ledger</span>
      </div>

      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">List Accounts</h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Master repository of all registered customer bank accounts and current balances.
            </p>
          </div>
        </div>

        <button
          id="list-create-account-btn"
          onClick={() => setScreen('create-account')}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-violet-600/20 shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Account</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="accounts-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by holder or account #..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            id="accounts-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-700 text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Account Types</option>
            <option value="Savings">Savings</option>
            <option value="Checking">Checking</option>
            <option value="Business">Business</option>
            <option value="Investment">Investment</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Account Number</th>
                <th scope="col" className="px-6 py-4 font-semibold">Account Holder</th>
                <th scope="col" className="px-6 py-4 font-semibold">Type</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Balance</th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr
                    key={account.accountNumber}
                    className="hover:bg-neutral-800/50 transition-colors group"
                  >
                    {/* Account Number */}
                    <td className="px-6 py-4 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{account.accountNumber}</span>
                      </div>
                    </td>

                    {/* Account Holder */}
                    <td className="px-6 py-4 font-medium text-neutral-200">
                      <div className="font-semibold text-white">{account.accountHolder}</div>
                      <span className="text-[11px] text-neutral-500">{account.email || 'Verified Holder'}</span>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-950 text-violet-300 border border-violet-800/40">
                        {account.accountType}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="px-6 py-4 font-mono font-bold text-right text-emerald-400 text-sm sm:text-base whitespace-nowrap">
                      {currencySymbol}
                      {account.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          title="Deposit Funds"
                          onClick={() => handleAction(account, 'deposit')}
                          className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-white transition-colors"
                        >
                          <ArrowDownToLine className="w-4 h-4" />
                        </button>
                        <button
                          title="Withdraw Funds"
                          onClick={() => handleAction(account, 'withdraw')}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-white transition-colors"
                        >
                          <ArrowUpFromLine className="w-4 h-4" />
                        </button>
                        <button
                          title="Transfer Money"
                          onClick={() => handleAction(account, 'transfer')}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white transition-colors"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                        <button
                          title="Transaction History"
                          onClick={() => handleAction(account, 'transaction-history')}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                    No matching bank accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Requirement: "Total Accounts: X." */}
        <div
          id="list-accounts-footer"
          className="bg-neutral-950 px-6 py-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
        >
          <div className="font-bold text-white tracking-wide">
            Total Accounts: <span className="text-violet-400 font-mono text-sm">{totalAccounts}</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-300 font-mono">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Combined Total Liquidity:</span>
            <strong className="text-emerald-400 text-sm">
              {currencySymbol}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
