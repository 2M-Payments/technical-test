
import { z } from 'zod';
import {
  createTransactionSchema,
  updateTransactionSchema,
  createManyTransactionsSchema,
  deleteManyTransactionsSchema,
} from '../../schemas/transactionSchema'; 
import { TransactionType } from '../../entities/Transaction';

describe('Transaction Schemas', () => {
  describe('createTransactionSchema', () => {
    it('deve validar um payload correto de uma transação', () => {
      const validData = {
        title: 'Salário',
        amount: 5000,
        type: TransactionType.ENTRADA, 
      };
      expect(() => createTransactionSchema.parse(validData)).not.toThrow();
    });

    it('deve falhar se o montante não for positivo', () => {
      const invalidData = {
        title: 'Dívida',
        amount: -100,
        type: TransactionType.SAIDA,
      };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('deve falhar se o tipo for invalido', () => {
      const invalidData = {
        title: 'Investimento',
        amount: 300,
        type: 'investment', 
      };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(z.ZodError);
    });
  });

  describe('updateTransactionSchema', () => {
    it('deve validar o payload com um único campo', () => {
      const partialData = { title: 'Correção do Salário' };
      expect(() => updateTransactionSchema.parse(partialData)).not.toThrow();
    });

    it('deve validar um payload vazio', () => {
      const emptyData = {};
      expect(() => updateTransactionSchema.parse(emptyData)).not.toThrow();
    });

    it('deve falhar se um campo for inválido', () => {
      const invalidPartialData = { amount: 'mil reais' }; 
      expect(() => updateTransactionSchema.parse(invalidPartialData)).toThrow(z.ZodError);
    });
  });

  describe('createManyTransactionsSchema', () => {
    it('deve validar um array de transações corretas', () => {
        const validArray = [
            { title: 'Salário', amount: 5000, type: TransactionType.ENTRADA },
            { title: 'Aluguel', amount: 1500, type: TransactionType.SAIDA }
        ];
        expect(() => createManyTransactionsSchema.parse(validArray)).not.toThrow();
    });

    it('deve falhar se qualquer objeto no array for inválido', () => {
        const invalidArray = [
            { title: 'Salário', amount: 5000, type: TransactionType.ENTRADA },
            { title: 'Aluguel', amount: -1500, type: TransactionType.SAIDA }
        ];
        expect(() => createManyTransactionsSchema.parse(invalidArray)).toThrow(z.ZodError);
    });
  });

  describe('deleteManyTransactionsSchema', () => {
    it('deve validar um array de UUIDs', () => {
        const validData = {
            ids: ['d0b7c3e1-3b7c-4b1f-8f0a-1e2c3d4b5e6f', 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d']
        };
        expect(() => deleteManyTransactionsSchema.parse(validData)).not.toThrow();
    });

    it('deve falhar se a string não é um UUID', () => {
        const invalidData = {
            ids: ['d0b7c3e1-3b7c-4b1f-8f0a-1e2c3d4b5e6f', 'not-a-valid-uuid']
        };
        expect(() => deleteManyTransactionsSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('deve falhar se os ids do array estão vazios', () => {
        const invalidData = { ids: [] };
        expect(() => deleteManyTransactionsSchema.parse(invalidData)).toThrow(z.ZodError);
    });
  });
});