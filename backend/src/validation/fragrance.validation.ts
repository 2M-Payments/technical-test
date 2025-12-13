import { z } from 'zod';

export const CreateFragranceSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
  active: z.boolean()
    .default(true)
});

export const UpdateFragranceSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
  active: z.boolean()
    .optional()
});

export type CreateFragranceDTO = z.infer<typeof CreateFragranceSchema>;
export type UpdateFragranceDTO = z.infer<typeof UpdateFragranceSchema>;
