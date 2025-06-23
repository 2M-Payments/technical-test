import * as z from 'zod';

export const transactionSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres.'),
  amount: z.coerce.number().positive('O valor deve ser um número positivo.'),
  type: z.enum(['ganho', 'despesa'], {
    errorMap: () => ({ message: 'Selecione um tipo válido.' }),
  }),
});

export const batchTransactionSchema = z.object({
  transactions: z.array(transactionSchema).min(1, "Adicione pelo menos uma transação."),
});

export const transactionFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo",
  }),
  type: z.enum(['ganho', 'despesa']),
});