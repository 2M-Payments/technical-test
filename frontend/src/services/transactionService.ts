import {type  AxiosResponse } from 'axios';
import api from './api';

import { 
  type Transaction, 
  type TransactionInput, 
  type Summary, 
  type PaginationInfo 
} from '../types/transaction.types';


type PaginatedTransactionsResponse = PaginationInfo & {
  data: Transaction[];
}

export const getTransactions = (page: number = 1, limit: number = 10): Promise<AxiosResponse<PaginatedTransactionsResponse>> => {
  return api.get<PaginatedTransactionsResponse>(`/transactions?page=${page}&limit=${limit}`);
};

export const getSummary = (): Promise<AxiosResponse<Summary>> => {
  return api.get<Summary>('/transactions/summary');
};

export const getTransactionById = (id: string): Promise<AxiosResponse<Transaction>> => {
  return api.get<Transaction>(`/transactions/${id}`);
};

export const createTransaction = (data: TransactionInput): Promise<AxiosResponse<Transaction>> => {
  return api.post<Transaction>('/transactions', data);
};

export const createBatchTransactions = (transactions: TransactionInput[]): Promise<AxiosResponse<Transaction[]>> => {
  return api.post<Transaction[]>('/transactions/batch', transactions);
};

export const updateTransaction = (id: string, data: Partial<TransactionInput>): Promise<AxiosResponse<Transaction>> => {
  return api.put<Transaction>(`/transactions/${id}`, data);
};

export const deleteTransaction = (id: string): Promise<AxiosResponse<void>> => {
  return api.delete<void>(`/transactions/${id}`);
};

export const deleteBatchTransactions = (ids: string[]): Promise<AxiosResponse<void>> => {
  return api.delete<void>('/transactions/batch', { data: { ids } });
};

export const deleteAllTransactions = (): Promise<AxiosResponse<void>> => {
  return api.delete<void>('/transactions/all');
};