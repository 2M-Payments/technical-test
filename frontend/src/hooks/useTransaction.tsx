import { useContext } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import {type TransactionContextData } from '../types/transaction.types';

export const useTransaction = (): TransactionContextData => {
  const context = useContext(TransactionContext);

  if (!Object.keys(context).length) {
    throw new Error('useTransactions deve ser usado dentro de um TransactionProvider');
  }

  return context;
};