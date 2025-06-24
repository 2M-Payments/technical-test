import { createContext } from 'react';
import {type TransactionContextData } from '../types/transactionTypes';


const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export default TransactionContext;