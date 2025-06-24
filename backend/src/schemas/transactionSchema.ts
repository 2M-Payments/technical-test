import { z } from 'zod';
import { TransactionType } from '../entities/transaction';

export const createTransactionSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  amount: z.number().positive('O valor deve ser positivo'),
  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "O tipo deve ser 'ganho' ou 'despesa'" }),
  }),
});

export const createManyTransactionsSchema = z.array(createTransactionSchema);

export const deleteManyTransactionsSchema = z.object({
  ids: z.array(z.string().uuid('ID inválido, deve ser um UUID')).min(1, 'É necessário fornecer ao menos um ID'),
});

export const updateTransactionSchema = createTransactionSchema.partial();
