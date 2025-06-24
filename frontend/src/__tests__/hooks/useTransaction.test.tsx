import { renderHook } from '@testing-library/react';
import TransactionContext from '../../contexts/TransactionContext';
import { useTransaction } from '../../hooks/useTransaction';
import { type TransactionContextData } from '../../types/transactionTypes';
import { type ReactNode } from 'react';

const createTransactionWrapper = (value: TransactionContextData) => ({ children }: { children: ReactNode }) => (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
);

describe('useTransaction Hook', () => {
    it('deve lançar um erro quando usado fora de um TransactionProvider', () => {
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => renderHook(() => useTransaction())).toThrow(
            'useTransactions deve ser usado dentro de um TransactionProvider'
        );

        console.error = originalError;
    });

    it('deve retornar o contexto quando usado dentro de um TransactionProvider', () => {
        const mockContextValue: TransactionContextData = {
            transactions: [],
            summary: { income: 100, expense: 50, total: 50 },
            pagination: { page: 1, totalPages: 1, total: 0 },
            loading: false,
            fetchData: jest.fn(),
            addTransaction: jest.fn(),
            createBatchTransactions: jest.fn(),
            removeTransaction: jest.fn(),
            editTransaction: jest.fn(),
            deleteBatchTransactions: jest.fn(),
            deleteAllTransactions: jest.fn(),
        };

        const { result } = renderHook(() => useTransaction(), {
            wrapper: createTransactionWrapper(mockContextValue),
        });

        expect(result.current.summary.total).toBe(50);
        expect(result.current.loading).toBe(false);
    });
});

