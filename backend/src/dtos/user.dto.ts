import { z } from 'zod';

import { UserStatus } from '../entities/user-status.enum';

const MAX_BATCH_SIZE = 100;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isoDate = z.string().regex(ISO_DATE, 'Use o formato AAAA-MM-DD');

const regionCodesSchema = z
  .array(z.string().trim().toUpperCase().length(2, 'Código de região deve ter 2 letras'))
  .min(1, 'Informe ao menos uma região')
  .transform((codes) => [...new Set(codes)]);

const userFields = {
  name: z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres').max(120),
  email: z.string().trim().toLowerCase().email('E-mail inválido').max(180),
  // 72 é o limite efetivo do bcrypt.
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres').max(72),
  status: z.nativeEnum(UserStatus),
  regionCodes: regionCodesSchema,
};

export const createUserSchema = z.object({
  ...userFields,
  status: userFields.status.default(UserStatus.ACTIVE),
});

export const bulkCreateUsersSchema = z
  .object({
    users: z
      .array(createUserSchema)
      .min(1, 'Informe ao menos um usuário')
      .max(MAX_BATCH_SIZE, `Máximo de ${MAX_BATCH_SIZE} usuários por lote`),
  })
  .superRefine(({ users }, ctx) => {
    const seen = new Set<string>();
    users.forEach((user, index) => {
      if (seen.has(user.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['users', index, 'email'],
          message: 'E-mail duplicado no lote',
        });
      }
      seen.add(user.email);
    });
  });

export const updateUserSchema = z
  .object({
    name: userFields.name.optional(),
    email: userFields.email.optional(),
    password: userFields.password.optional(),
    status: userFields.status.optional(),
    regionCodes: regionCodesSchema.optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar',
  });

export const USER_SORTABLE_FIELDS = ['name', 'email', 'status', 'createdAt'] as const;

export const listUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().min(1).max(120).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    regionCode: z.string().trim().toUpperCase().length(2).optional(),
    // Datas são interpretadas em UTC; `createdTo` inclui o dia inteiro.
    createdFrom: isoDate.transform((value) => new Date(`${value}T00:00:00.000Z`)).optional(),
    createdTo: isoDate.transform((value) => new Date(`${value}T23:59:59.999Z`)).optional(),
    sortBy: z.enum(USER_SORTABLE_FIELDS).default('createdAt'),
    sortOrder: z
      .enum(['asc', 'desc', 'ASC', 'DESC'])
      .transform((value) => value.toUpperCase() as 'ASC' | 'DESC')
      .default('DESC'),
  })
  .refine(
    ({ createdFrom, createdTo }) => !createdFrom || !createdTo || createdFrom <= createdTo,
    { message: 'A data inicial deve ser anterior ou igual à data final', path: ['createdFrom'] },
  );

export const userIdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const bulkDeleteUsersSchema = z.object({
  ids: z
    .array(z.string().uuid('ID inválido'))
    .min(1, 'Informe ao menos um ID')
    .max(MAX_BATCH_SIZE, `Máximo de ${MAX_BATCH_SIZE} IDs por requisição`)
    .transform((ids) => [...new Set(ids)]),
});

/** Excluir todos exige confirmação explícita para evitar acidentes. */
export const deleteAllUsersQuerySchema = z.object({
  confirm: z.literal('true', {
    errorMap: () => ({ message: 'Envie confirm=true para excluir todos os usuários' }),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type BulkCreateUsersInput = z.infer<typeof bulkCreateUsersSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UserSortableField = (typeof USER_SORTABLE_FIELDS)[number];
