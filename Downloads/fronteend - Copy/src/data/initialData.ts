import { BankAccount, Transaction } from '../types/banking';

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    accountNumber: '1029',
    accountHolder: 'Lady',
    balance: 48500.75,
    accountType: 'Savings',
    cardColor: 'royal',
    status: 'Active',
    createdAt: '2025-01-15T08:30:00Z',
    email: 'lady@nexusbank.io',
    phone: '+63 (917) 123-4567',
  },
  {
    accountNumber: 'ACC-4912-7703',
    accountHolder: 'Sophia Ramirez',
    balance: 18240.50,
    accountType: 'Checking',
    cardColor: 'ocean',
    status: 'Active',
    createdAt: '2025-03-22T11:15:00Z',
    email: 'sophia.r@nexusbank.io',
    phone: '+1 (555) 876-5432',
  },
  {
    accountNumber: 'ACC-6204-9182',
    accountHolder: 'Marcus Vance',
    balance: 92400.00,
    accountType: 'Business',
    cardColor: 'emerald',
    status: 'Active',
    createdAt: '2024-11-05T14:45:00Z',
    email: 'marcus.v@vancetech.com',
    phone: '+1 (555) 345-6789',
  },
  {
    accountNumber: 'ACC-3195-4421',
    accountHolder: 'Chloe Chen',
    balance: 6750.25,
    accountType: 'Savings',
    cardColor: 'rose',
    status: 'Active',
    createdAt: '2025-06-10T09:20:00Z',
    email: 'chloe.chen@nexusbank.io',
    phone: '+1 (555) 987-6543',
  },
  {
    accountNumber: 'ACC-7051-8843',
    accountHolder: 'Liam Gallagher',
    balance: 3120.00,
    accountType: 'Checking',
    cardColor: 'amber',
    status: 'Active',
    createdAt: '2025-08-01T16:00:00Z',
    email: 'liam.g@nexusbank.io',
    phone: '+1 (555) 456-7890',
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-90124',
    accountNumber: '1029',
    type: 'Deposit',
    amount: 5000.00,
    date: '2026-08-14T10:30:00Z',
    balanceAfter: 48500.75,
    description: 'Direct Salary Credit - Vault Transfer',
    status: 'Completed',
    category: 'Income'
  },
  {
    id: 'TXN-90118',
    accountNumber: '1029',
    type: 'Transfer-Out',
    amount: 1500.00,
    date: '2026-08-12T15:22:00Z',
    referenceAccount: 'ACC-4912-7703',
    balanceAfter: 43500.75,
    description: 'Transfer to Sophia Ramirez',
    status: 'Completed',
    category: 'Transfer'
  },
  {
    id: 'TXN-90119',
    accountNumber: 'ACC-4912-7703',
    type: 'Transfer-In',
    amount: 1500.00,
    date: '2026-08-12T15:22:00Z',
    referenceAccount: '1029',
    balanceAfter: 18240.50,
    description: 'Transfer received from Lady',
    status: 'Completed',
    category: 'Transfer'
  },
  {
    id: 'TXN-90095',
    accountNumber: 'ACC-6204-9182',
    type: 'Deposit',
    amount: 25000.00,
    date: '2026-08-10T09:14:00Z',
    balanceAfter: 92400.00,
    description: 'Client Invoice #8841 Settlement',
    status: 'Completed',
    category: 'Business'
  },
  {
    id: 'TXN-90082',
    accountNumber: 'ACC-4912-7703',
    type: 'Withdraw',
    amount: 450.00,
    date: '2026-08-08T18:40:00Z',
    balanceAfter: 16740.50,
    description: 'ATM Cash Withdrawal Downtown Branch',
    status: 'Completed',
    category: 'Cash'
  },
  {
    id: 'TXN-90040',
    accountNumber: 'ACC-3195-4421',
    type: 'Deposit',
    amount: 1200.00,
    date: '2026-08-05T12:00:00Z',
    balanceAfter: 6750.25,
    description: 'E-Transfer from External Savings',
    status: 'Completed',
    category: 'Deposit'
  },
  {
    id: 'TXN-90011',
    accountNumber: 'ACC-7051-8843',
    type: 'Initial-Deposit',
    amount: 3120.00,
    date: '2025-08-01T16:00:00Z',
    balanceAfter: 3120.00,
    description: 'New Account Opening Deposit',
    status: 'Completed',
    category: 'Opening'
  }
];
