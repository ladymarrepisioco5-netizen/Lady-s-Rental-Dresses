import React, { createContext, useContext, useState, useEffect } from 'react';
import { BankAccount, Transaction, AppScreen, AccountType, CardColorTheme } from '../types/banking';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS } from '../data/initialData';
import confetti from 'canvas-confetti';
import { transfer as transferApi } from "../api"; // import yung transfer function sa api.ts

interface DepositResult {
  success: boolean;
  prevBalance: number;
  depositAmount: number;
  newBalance: number;
  account?: BankAccount;
  transaction?: Transaction;
  error?: string;
}

interface WithdrawResult {
  success: boolean;
  prevBalance: number;
  withdrawAmount: number;
  newBalance: number;
  account?: BankAccount;
  transaction?: Transaction;
  error?: string;
}

interface TransferResult {
  success: boolean;
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
  error?: string;
}

interface CreateAccountResult {
  success: boolean;
  account?: BankAccount;
  transaction?: Transaction;
  error?: string;
}

interface BalanceInquiryResult {
  success: boolean;
  account?: BankAccount;
  error?: string;
}

interface BankingContextType {
  accounts: BankAccount[];
  transactions: Transaction[];
  activeScreen: AppScreen;
  selectedAccount: BankAccount | null;
  currencySymbol: string;
  setCurrencySymbol: (sym: string) => void;
  setScreen: (screen: AppScreen) => void;
  setSelectedAccount: (account: BankAccount | null) => void;
  createAccount: (data: {
    accountNumber: string;
    accountHolder: string;
    initialDeposit: number;
    accountType?: AccountType;
    cardColor?: CardColorTheme;
  }) => CreateAccountResult;
  checkBalance: (accountNumber: string) => BalanceInquiryResult;
  deposit: (accountNumber: string, amount: number, note?: string) => DepositResult;
  withdraw: (accountNumber: string, amount: number, note?: string) => WithdrawResult;
  transfer: (sourceAccount: string, destAccount: string, amount: number, note?: string) => TransferResult;
  getAccountTransactions: (accountNumber?: string) => Transaction[];
  getAccountByNumber: (accountNumber: string) => BankAccount | undefined;
  resetAllData: () => void;
  generateUniqueAccountNumber: () => string;
  triggerConfetti: () => void;
  lastActionResult: {
    type: 'create' | 'deposit' | 'withdraw' | 'transfer' | 'inquiry';
    data: any;
  } | null;
  setLastActionResult: (result: any) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const STORAGE_KEY_ACCOUNTS = 'nexus_bank_accounts_v1';
const STORAGE_KEY_TRANSACTIONS = 'nexus_bank_transactions_v1';

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load accounts from storage', e);
    }
    return INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load transactions from storage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [activeScreen, setActiveScreen] = useState<AppScreen>('splash-1');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string>('₱');
  const [lastActionResult, setLastActionResult] = useState<{
    type: 'create' | 'deposit' | 'withdraw' | 'transfer' | 'inquiry';
    data: any;
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899']
      });
    } catch (e) {
      // ignore in environments without canvas
    }
  };

  const generateUniqueAccountNumber = (): string => {
    let num = '';
    let exists = true;
    while (exists) {
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      num = `ACC-${part1}-${part2}`;
      exists = accounts.some((a) => a.accountNumber.toUpperCase() === num.toUpperCase());
    }
    return num;
  };

  const getAccountByNumber = (accountNumber: string): BankAccount | undefined => {
    const cleanNumber = accountNumber.trim().toUpperCase();
    return accounts.find(
      (a) =>
        a.accountNumber.toUpperCase() === cleanNumber ||
        a.accountNumber.replace(/[^A-Z0-9]/gi, '') === cleanNumber.replace(/[^A-Z0-9]/gi, '')
    );
  };

  const createAccount = ({
    accountNumber,
    accountHolder,
    initialDeposit,
    accountType = 'Savings',
    cardColor = 'violet',
  }: {
    accountNumber: string;
    accountHolder: string;
    initialDeposit: number;
    accountType?: AccountType;
    cardColor?: CardColorTheme;
  }): CreateAccountResult => {
    const cleanNum = accountNumber.trim().toUpperCase();
    const cleanHolder = accountHolder.trim();

    if (!cleanNum) {
      return { success: false, error: 'Account Number is required.' };
    }
    if (!cleanHolder) {
      return { success: false, error: 'Account Holder Name is required.' };
    }
    if (isNaN(initialDeposit) || initialDeposit < 0) {
      return { success: false, error: 'Initial deposit cannot be negative.' };
    }

    const existing = getAccountByNumber(cleanNum);
    if (existing) {
      return { success: false, error: `Account with number ${cleanNum} already exists.` };
    }

    const newAccount: BankAccount = {
      accountNumber: cleanNum,
      accountHolder: cleanHolder,
      balance: initialDeposit,
      accountType,
      cardColor,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    let initialTxn: Transaction | undefined;
    if (initialDeposit > 0) {
      const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
      initialTxn = {
        id: txnId,
        accountNumber: cleanNum,
        type: 'Initial-Deposit',
        amount: initialDeposit,
        date: new Date().toISOString(),
        balanceAfter: initialDeposit,
        description: 'Initial Account Deposit',
        status: 'Completed',
        category: 'Opening',
      };
      setTransactions((prev) => [initialTxn!, ...prev]);
    }

    setAccounts((prev) => [newAccount, ...prev]);
    triggerConfetti();

    return {
      success: true,
      account: newAccount,
      transaction: initialTxn,
    };
  };

  const checkBalance = (accountNumber: string): BalanceInquiryResult => {
    if (!accountNumber || !accountNumber.trim()) {
      return { success: false, error: 'Please enter an account number.' };
    }
    const account = getAccountByNumber(accountNumber);
    if (!account) {
      return { success: false, error: 'Account not found.' };
    }
    return { success: true, account };
  };

  const deposit = (accountNumber: string, amount: number, note?: string): DepositResult => {
    if (!accountNumber || !accountNumber.trim()) {
      return { success: false, prevBalance: 0, depositAmount: 0, newBalance: 0, error: 'Please specify an account number.' };
    }
    if (isNaN(amount) || amount <= 0) {
      return { success: false, prevBalance: 0, depositAmount: 0, newBalance: 0, error: 'Deposit amount must be greater than 0.' };
    }

    const account = getAccountByNumber(accountNumber);
    if (!account) {
      return { success: false, prevBalance: 0, depositAmount: 0, newBalance: 0, error: 'Account not found.' };
    }

    const prevBalance = account.balance;
    const newBalance = Math.round((prevBalance + amount) * 100) / 100;

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn: Transaction = {
      id: txnId,
      accountNumber: account.accountNumber,
      type: 'Deposit',
      amount,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
      description: note || 'Cash / Electronic Deposit',
      status: 'Completed',
      category: 'Deposit',
    };

    const updatedAccount = { ...account, balance: newBalance };

    setAccounts((prev) =>
      prev.map((acc) => (acc.accountNumber === account.accountNumber ? updatedAccount : acc))
    );
    setTransactions((prev) => [newTxn, ...prev]);
    triggerConfetti();

    return {
      success: true,
      prevBalance,
      depositAmount: amount,
      newBalance,
      account: updatedAccount,
      transaction: newTxn,
    };
  };

  const withdraw = (accountNumber: string, amount: number, note?: string): WithdrawResult => {
    if (!accountNumber || !accountNumber.trim()) {
      return { success: false, prevBalance: 0, withdrawAmount: 0, newBalance: 0, error: 'Please enter an account number.' };
    }
    if (isNaN(amount) || amount <= 0) {
      return { success: false, prevBalance: 0, withdrawAmount: 0, newBalance: 0, error: 'Withdrawal amount must be greater than 0.' };
    }

    const account = getAccountByNumber(accountNumber);
    if (!account) {
      return { success: false, prevBalance: 0, withdrawAmount: 0, newBalance: 0, error: 'Account not found.' };
    }

    if (account.balance < amount) {
      return {
        success: false,
        prevBalance: account.balance,
        withdrawAmount: amount,
        newBalance: account.balance,
        error: 'Insufficient Balance.',
      };
    }

    const prevBalance = account.balance;
    const newBalance = Math.round((prevBalance - amount) * 100) / 100;

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn: Transaction = {
      id: txnId,
      accountNumber: account.accountNumber,
      type: 'Withdraw',
      amount,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
      description: note || 'Cash Withdrawal',
      status: 'Completed',
      category: 'Withdraw',
    };

    const updatedAccount = { ...account, balance: newBalance };

    setAccounts((prev) =>
      prev.map((acc) => (acc.accountNumber === account.accountNumber ? updatedAccount : acc))
    );
    setTransactions((prev) => [newTxn, ...prev]);

    return {
      success: true,
      prevBalance,
      withdrawAmount: amount,
      newBalance,
      account: updatedAccount,
      transaction: newTxn,
    };
  };

  const transfer = (
    sourceAccount: string,
    destAccount: string,
    amount: number,
    note?: string
  ): TransferResult => {
    if (!sourceAccount || !sourceAccount.trim()) {
      return { success: false, fromAccount: sourceAccount, toAccount: destAccount, amount, error: 'Please enter Source Account.' };
    }
    if (!destAccount || !destAccount.trim()) {
      return { success: false, fromAccount: sourceAccount, toAccount: destAccount, amount, error: 'Please enter Destination Account.' };
    }
    if (isNaN(amount) || amount <= 0) {
      return { success: false, fromAccount: sourceAccount, toAccount: destAccount, amount, error: 'Transfer amount must be greater than 0.' };
    }

    const srcAcc = getAccountByNumber(sourceAccount);
    const dstAcc = getAccountByNumber(destAccount);

    if (!srcAcc) {
      return { success: false, fromAccount: sourceAccount, toAccount: destAccount, amount, error: 'Invalid Account (Source Account not found).' };
    }
    if (!dstAcc) {
      return { success: false, fromAccount: sourceAccount, toAccount: destAccount, amount, error: 'Invalid Account (Destination Account not found).' };
    }

    if (srcAcc.accountNumber === dstAcc.accountNumber) {
      return { success: false, fromAccount: sourceAccount, toAccount: destAccount, amount, error: 'Source and Destination accounts cannot be the same.' };
    }

    if (srcAcc.balance < amount) {
      return {
        success: false,
        fromAccount: srcAcc.accountNumber,
        toAccount: dstAcc.accountNumber,
        amount,
        sourcePrevBalance: srcAcc.balance,
        error: 'Insufficient Balance.',
      };
    }

    const srcNewBalance = Math.round((srcAcc.balance - amount) * 100) / 100;
    const dstNewBalance = Math.round((dstAcc.balance + amount) * 100) / 100;

    const baseTxnId = Math.floor(10000 + Math.random() * 90000);
    const txnOutId = `TXN-${baseTxnId}-OUT`;
    const txnInId = `TXN-${baseTxnId}-IN`;

    const now = new Date().toISOString();

    const txnOut: Transaction = {
      id: txnOutId,
      accountNumber: srcAcc.accountNumber,
      type: 'Transfer-Out',
      amount,
      date: now,
      referenceAccount: dstAcc.accountNumber,
      balanceAfter: srcNewBalance,
      description: note ? `Transfer to ${dstAcc.accountHolder}: ${note}` : `Transfer to ${dstAcc.accountHolder} (${dstAcc.accountNumber})`,
      status: 'Completed',
      category: 'Transfer',
    };

    const txnIn: Transaction = {
      id: txnInId,
      accountNumber: dstAcc.accountNumber,
      type: 'Transfer-In',
      amount,
      date: now,
      referenceAccount: srcAcc.accountNumber,
      balanceAfter: dstNewBalance,
      description: note ? `Transfer from ${srcAcc.accountHolder}: ${note}` : `Transfer from ${srcAcc.accountHolder} (${srcAcc.accountNumber})`,
      status: 'Completed',
      category: 'Transfer',
    };

    const updatedSrc = { ...srcAcc, balance: srcNewBalance };
    const updatedDst = { ...dstAcc, balance: dstNewBalance };

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNumber === srcAcc.accountNumber) return updatedSrc;
        if (acc.accountNumber === dstAcc.accountNumber) return updatedDst;
        return acc;
      })
    );

    setTransactions((prev) => [txnOut, txnIn, ...prev]);
    triggerConfetti();

    return {
      success: true,
      fromAccount: srcAcc.accountNumber,
      toAccount: dstAcc.accountNumber,
      amount,
      sourcePrevBalance: srcAcc.balance,
      sourceNewBalance: srcNewBalance,
      destPrevBalance: dstAcc.balance,
      destNewBalance: dstNewBalance,
      sourceAccountObj: updatedSrc,
      destAccountObj: updatedDst,
      transactionId: `TXN-${baseTxnId}`,
    };
  };

  const getAccountTransactions = (accountNumber?: string): Transaction[] => {
    if (!accountNumber || accountNumber === 'ALL') {
      return transactions;
    }
    const cleanNum = accountNumber.trim().toUpperCase();
    return transactions.filter(
      (t) =>
        t.accountNumber.toUpperCase() === cleanNum ||
        t.referenceAccount?.toUpperCase() === cleanNum
    );
  };

  const resetAllData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSelectedAccount(null);
    setLastActionResult(null);
    try {
      localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
      localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    } catch (e) {
      console.error(e);
    }
  };

  const setScreen = (screen: AppScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        activeScreen,
        selectedAccount,
        currencySymbol,
        setCurrencySymbol,
        setScreen,
        setSelectedAccount,
        createAccount,
        checkBalance,
        deposit,
        withdraw,
        transfer,
        getAccountTransactions,
        getAccountByNumber,
        resetAllData,
        generateUniqueAccountNumber,
        triggerConfetti,
        lastActionResult,
        setLastActionResult,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = (): BankingContextType => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};

function BankingProvider({ children }) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  async function transfer(fromAccount: string, toAccount: string, amount: number, memo?: string) {
    try {
      const res = await transferApi(Number(fromAccount), Number(toAccount), amount);
      // dito pwede mong i-update ang local state ng accounts kung gusto mong makita agad ang bagong balance
      return {
        success: true,
        fromAccount,
        toAccount,
        amount,
        sourcePrevBalance: selectedAccount?.balance,
        sourceNewBalance: (selectedAccount?.balance || 0) - amount,
        destPrevBalance: accounts.find(a => a.accountNumber === toAccount)?.balance,
        destNewBalance: (accounts.find(a => a.accountNumber === toAccount)?.balance || 0) + amount,
        transactionId: crypto.randomUUID(), // sample lang, pwede galing backend
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return (
      <BankingContext.Provider value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        transfer,
        // other functions...
      }}>
        {children}
      </BankingContext.Provider>
  );
}