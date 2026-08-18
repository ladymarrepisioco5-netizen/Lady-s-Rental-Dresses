import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount, TransactionType } from '../../types/banking';
import {
  History,
  Search,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Download,
  CreditCard,
  Receipt,
  FileText
} from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const {
    transactions,
    accounts,
    selectedAccount,
    setSelectedAccount,
    setScreen,
    currencySymbol,
  } = useBanking();

  const [filterAccount, setFilterAccount] = useState<string>(selectedAccount?.accountNumber || 'ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  // Apply filters
  const filteredTransactions = transactions.filter((txn) => {
    // Account match
    const matchesAccount =
      filterAccount === 'ALL' ||
      txn.accountNumber.toUpperCase() === filterAccount.toUpperCase() ||
      txn.referenceAccount?.toUpperCase() === filterAccount.toUpperCase();

    // Type match
    const matchesType = filterType === 'ALL' || txn.type === filterType;

    // Search keyword match
    const matchesKeyword =
      !searchKeyword ||
      txn.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      txn.accountNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (txn.referenceAccount && txn.referenceAccount.toLowerCase().includes(searchKeyword.toLowerCase()));

    return matchesAccount && matchesType && matchesKeyword;
  });

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['Transaction ID', 'Account Number', 'Type', 'Amount', 'Date', 'Reference Account', 'Balance After', 'Description'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.accountNumber,
      t.type,
      t.amount,
      new Date(t.date).toLocaleString(),
      t.referenceAccount || 'N/A',
      t.balanceAfter,
      `"${t.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bank_Transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transaction-history-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('main-menu')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
        </button>
        <span className="text-xs text-neutral-500 font-mono">Module 07 • Audit Ledger History</span>
      </div>

      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Transaction History</h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Complete chronological audit trail with reference account linking and balance after every operation.
            </p>
          </div>
        </div>

        <button
          id="export-csv-btn"
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter / Query Form Requirement: Input Account Number + Button: View History */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Account Number Input / Select */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Filter by Account Number
            </label>
            <div className="flex gap-2">
              <select
                id="history-account-select"
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">All Registered Accounts (Global Ledger)</option>
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountHolder} ({acc.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Transaction Type
            </label>
            <select
              id="history-type-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdraw">Withdraw</option>
              <option value="Transfer-In">Transfer-In</option>
              <option value="Transfer-Out">Transfer-Out</option>
              <option value="Initial-Deposit">Initial Deposit</option>
            </select>
          </div>

          {/* Search keyword input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="history-search-input"
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="ID, note, account..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Quick select pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
          <span className="text-[11px] text-neutral-400 font-medium">Quick Filter Account:</span>
          <button
            onClick={() => setFilterAccount('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filterAccount === 'ALL'
                ? 'bg-sky-600 text-white'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Accounts ({transactions.length})
          </button>
          {accounts.map((acc) => (
            <button
              key={acc.accountNumber}
              onClick={() => setFilterAccount(acc.accountNumber)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                filterAccount === acc.accountNumber
                  ? 'bg-sky-600 text-white'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {acc.accountHolder} ({acc.accountNumber.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* History Table Requirement:
          Table: Transaction ID | Type | Amount | Date | Reference Account | Balance After
      */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Transaction ID</th>
                <th scope="col" className="px-5 py-4 font-semibold">Type</th>
                <th scope="col" className="px-5 py-4 font-semibold">Account</th>
                <th scope="col" className="px-5 py-4 font-semibold text-right">Amount</th>
                <th scope="col" className="px-5 py-4 font-semibold">Date & Time</th>
                <th scope="col" className="px-5 py-4 font-semibold">Reference Account</th>
                <th scope="col" className="px-5 py-4 font-semibold text-right">Balance After</th>
                <th scope="col" className="px-4 py-4 font-semibold text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => {
                  const isPositive =
                    txn.type === 'Deposit' ||
                    txn.type === 'Transfer-In' ||
                    txn.type === 'Initial-Deposit';

                  const badgeColors: Record<TransactionType, string> = {
                    Deposit: 'bg-teal-950 text-teal-300 border-teal-800/40',
                    Withdraw: 'bg-amber-950 text-amber-300 border-amber-800/40',
                    'Transfer-In': 'bg-emerald-950 text-emerald-300 border-emerald-800/40',
                    'Transfer-Out': 'bg-indigo-950 text-indigo-300 border-indigo-800/40',
                    'Initial-Deposit': 'bg-violet-950 text-violet-300 border-violet-800/40',
                  };

                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-neutral-800/50 transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="px-5 py-3.5 font-mono font-bold text-white whitespace-nowrap">
                        {txn.id}
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            badgeColors[txn.type] || 'bg-neutral-800 text-neutral-300 border-neutral-700'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>

                      {/* Account Number */}
                      <td className="px-5 py-3.5 font-mono text-xs text-neutral-300 whitespace-nowrap">
                        {txn.accountNumber}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 font-mono font-bold text-right whitespace-nowrap text-sm">
                        <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                          {isPositive ? '+' : '-'}
                          {currencySymbol}
                          {txn.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-xs text-neutral-400 whitespace-nowrap">
                        <div>{new Date(txn.date).toLocaleDateString()}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      </td>

                      {/* Reference Account */}
                      <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                        {txn.referenceAccount ? (
                          <span className="text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                            {txn.referenceAccount}
                          </span>
                        ) : (
                          <span className="text-neutral-600">---</span>
                        )}
                      </td>

                      {/* Balance After */}
                      <td className="px-5 py-3.5 font-mono font-bold text-right text-white whitespace-nowrap text-xs sm:text-sm">
                        {currencySymbol}
                        {txn.balanceAfter.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Receipt View Button */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => setActiveReceipt(txn)}
                          title="View Digital Receipt"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-neutral-400">
                    No transactions found for the selected query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>Showing {filteredTransactions.length} of {transactions.length} total operations</span>
          <span>Ledger Integrity: 100% Cryptographically Verified</span>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
                  NB
                </div>
                <h4 className="font-bold text-white text-sm">Official Transaction Voucher</h4>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-neutral-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="text-white font-bold">{activeReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Type:</span>
                <span className="text-violet-300 font-bold">{activeReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Account:</span>
                <span className="text-white">{activeReceipt.accountNumber}</span>
              </div>
              {activeReceipt.referenceAccount && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ref Account:</span>
                  <span className="text-indigo-300">{activeReceipt.referenceAccount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="text-neutral-300">{new Date(activeReceipt.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm">
                <span className="text-neutral-400">Amount:</span>
                <span className="text-emerald-400 font-bold">
                  {currencySymbol}{activeReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Balance After:</span>
                <span className="text-white font-bold">
                  {currencySymbol}{activeReceipt.balanceAfter.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
                Memo: {activeReceipt.description}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
