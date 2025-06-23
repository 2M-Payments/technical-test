import { createContext } from 'react';
import {type TransactionContextData } from '../types/transaction.types';


const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export default TransactionContext;