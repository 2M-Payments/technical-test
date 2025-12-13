import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  company: z.string().max(200, 'Nome da empresa muito longo').optional(),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use: (XX) XXXXX-XXXX')
    .optional()
});

export const UpdateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  company: z.string().max(200, 'Nome da empresa muito longo').optional(),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use: (XX) XXXXX-XXXX')
    .optional()
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
