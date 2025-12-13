import { z } from 'zod';

export const CreateFragranceSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  description: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  active: z.boolean().default(true)
});

export const UpdateFragranceSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .optional(),
  description: z.string()
    .max(500, 'Descrição não pode ter mais de 500 caracteres')
    .optional(),
  active: z.boolean().optional()
});

export type CreateFragranceInput = z.infer<typeof CreateFragranceSchema>;
export type UpdateFragranceInput = z.infer<typeof UpdateFragranceSchema>;
