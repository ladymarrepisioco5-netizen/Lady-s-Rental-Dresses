export type AccountType = 'Savings' | 'Checking' | 'Business' | 'Investment';

export type CardColorTheme = 'royal' | 'violet' | 'emerald' | 'amber' | 'ocean' | 'rose' | 'slate';

export interface BankAccount {
  accountNumber: string;
  accountHolder: string;
  balance: number;
  accountType: AccountType;
  cardColor: CardColorTheme;
  status: 'Active' | 'Dormant' | 'Frozen';
  createdAt: string;
  avatarSeed?: string;
  email?: string;
  phone?: string;
}

export type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer-In' | 'Transfer-Out' | 'Initial-Deposit';

export interface Transaction {
  id: string;
  accountNumber: string;
  type: TransactionType;
  amount: number;
  date: string;
  referenceAccount?: string;
  balanceAfter: number;
  description: string;
  status: 'Completed' | 'Failed' | 'Pending';
  category?: string;
}

export type AppScreen =
  | 'splash-1'
  | 'splash-2'
  | 'intro-cards'
  | 'main-menu'
  | 'create-account'
  | 'balance-inquiry'
  | 'list-accounts'
  | 'deposit'
  | 'withdraw'
  | 'transfer'
  | 'transaction-history'
  | 'exit';
