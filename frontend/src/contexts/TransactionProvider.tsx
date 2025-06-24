import { useState, useCallback } from 'react';
import TransactionContext from './TransactionContext';
import * as transactionService from '../services/transactionService';

import { 
  type Transaction, 
  type TransactionInput, 
  type Summary, 
  type TransactionProviderProps,
  type PaginationInfo
} from '../types/transactionTypes';

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, total: 0 });
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const [transResponse, summaryResponse] = await Promise.all([
        transactionService.getTransactions(page),
        transactionService.getSummary(),
      ]);

      setTransactions(transResponse.data.data);
      setPagination({
        page: transResponse.data.page,
        totalPages: transResponse.data.totalPages,
        total: transResponse.data.total,
      });
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados das transações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (data: TransactionInput) => { 
    try {
      await transactionService.createTransaction(data);
      await fetchData(pagination.page);
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
    }
  };

  const createBatchTransactions = async (data: TransactionInput[]) => {
    try {
      setLoading(true);
      await transactionService.createBatchTransactions(data);
      await fetchData(1);
    } catch (error) {
      console.error("Erro ao criar transações em lote:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeTransaction = async (id: string) => { 
    try {
      await transactionService.deleteTransaction(id);
      await fetchData(pagination.page);
    } catch(error) {
      console.error("Erro ao remover transação:", error);
    }
  };
 

  const editTransaction = async (id: string, data: Partial<TransactionInput>) => {
    try {
      setLoading(true);
      await transactionService.updateTransaction(id, data);
      await fetchData(pagination.page); 
    } catch (error) {
      console.error("Erro ao editar transação:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBatchTransactions = async (ids: string[]) => {
    try {
      setLoading(true);
      await transactionService.deleteBatchTransactions(ids);
      await fetchData(1); 
    } catch (error) {
      console.error("Erro ao deletar transações em lote:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllTransactions = async () => {
    try {
      setLoading(true);
      await transactionService.deleteAllTransactions();
      await fetchData(1); 
    } catch (error) {
      console.error("Erro ao deletar todas as transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    transactions,
    summary,
    pagination,
    loading,
    fetchData,
    addTransaction,
    createBatchTransactions,
    removeTransaction,
    editTransaction,
    deleteBatchTransactions,
    deleteAllTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};