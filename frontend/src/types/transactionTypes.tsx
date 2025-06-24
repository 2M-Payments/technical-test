import {type ReactNode } from 'react';
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'ganho' | 'despesa';
  createdAt: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
export interface Summary {
  income: number;
  expense: number;
  total: number;
}
export interface PaginationInfo {
    page: number;
    totalPages: number;
    total: number;
}
export interface TransactionContextData {
  transactions: Transaction[];
  summary: Summary;
  pagination: PaginationInfo;
  loading: boolean;
  fetchData: (page?: number) => Promise<void>;
  addTransaction: (data: TransactionInput) => Promise<void>;
  createBatchTransactions: (data: TransactionInput[]) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  deleteBatchTransactions: (ids: string[]) => Promise<void>;
  deleteAllTransactions: () => Promise<void>;
  editTransaction: (id: string, data: Partial<TransactionInput>) => Promise<void>;
  
}
export interface TransactionProviderProps {
    children: ReactNode;
}