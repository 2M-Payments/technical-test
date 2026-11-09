import {
  bulkCreateUsersSchema,
  bulkDeleteUsersSchema,
  createUserSchema,
  deleteAllUsersQuerySchema,
  listUsersQuerySchema,
  updateUserSchema,
} from '../../../dtos/user.dto';
import { UserStatus } from '../../../entities/user-status.enum';

const validUser = {
  name: '  Maria Silva ',
  email: 'MARIA@Email.com',
  password: 'senha-segura',
  regionCodes: ['br', 'gb', 'BR'],
};

describe('user.schemas', () => {
  describe('createUserSchema', () => {
    it('normaliza os dados e aplica o status padrão', () => {
      expect(createUserSchema.parse(validUser)).toEqual({
        name: 'Maria Silva',
        email: 'maria@email.com',
        password: 'senha-segura',
        status: UserStatus.ACTIVE,
        regionCodes: ['BR', 'GB'],
      });
    });

    it('exige ao menos uma região', () => {
      const result = createUserSchema.safeParse({ ...validUser, regionCodes: [] });

      expect(result.success).toBe(false);
    });

    it('rejeita e-mail inválido e senha curta', () => {
      const result = createUserSchema.safeParse({ ...validUser, email: 'x', password: '123' });

      expect(result.success).toBe(false);
      expect(result.error?.issues.map((i) => i.path[0])).toEqual(['email', 'password']);
    });
  });

  describe('bulkCreateUsersSchema', () => {
    it('rejeita e-mails duplicados dentro do mesmo lote', () => {
      const result = bulkCreateUsersSchema.safeParse({
        users: [validUser, { ...validUser, email: 'maria@email.com' }],
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]).toMatchObject({
        path: ['users', 1, 'email'],
        message: 'E-mail duplicado no lote',
      });
    });
  });

  describe('updateUserSchema', () => {
    it('aceita atualização parcial', () => {
      expect(updateUserSchema.parse({ status: 'INACTIVE' })).toEqual({ status: 'INACTIVE' });
    });

    it('rejeita corpo vazio e campos desconhecidos', () => {
      expect(updateUserSchema.safeParse({}).success).toBe(false);
      expect(updateUserSchema.safeParse({ role: 'admin' }).success).toBe(false);
    });
  });

  describe('listUsersQuerySchema', () => {
    it('aplica valores padrão de paginação e ordenação', () => {
      expect(listUsersQuerySchema.parse({})).toEqual({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
    });

    it('converte query strings e cobre o dia inteiro no filtro de data', () => {
      const query = listUsersQuerySchema.parse({
        page: '2',
        limit: '5',
        regionCode: 'gb',
        createdFrom: '2026-10-01',
        createdTo: '2026-10-26',
        sortOrder: 'asc',
      });

      expect(query).toMatchObject({ page: 2, limit: 5, regionCode: 'GB', sortOrder: 'ASC' });
      expect(query.createdFrom?.toISOString()).toBe('2026-10-01T00:00:00.000Z');
      expect(query.createdTo?.toISOString()).toBe('2026-10-26T23:59:59.999Z');
    });

    it('rejeita período invertido, limite acima do máximo e ordenação por campo não permitido', () => {
      expect(
        listUsersQuerySchema.safeParse({ createdFrom: '2026-10-26', createdTo: '2026-10-01' })
          .success,
      ).toBe(false);
      expect(listUsersQuerySchema.safeParse({ limit: '500' }).success).toBe(false);
      expect(listUsersQuerySchema.safeParse({ sortBy: 'passwordHash' }).success).toBe(false);
    });
  });

  describe('exclusões', () => {
    it('remove IDs duplicados na exclusão em lote', () => {
      const id = '6f1c1a8e-0000-4000-8000-000000000000';

      expect(bulkDeleteUsersSchema.parse({ ids: [id, id] })).toEqual({ ids: [id] });
    });

    it('exige confirm=true para excluir todos', () => {
      expect(deleteAllUsersQuerySchema.safeParse({}).success).toBe(false);
      expect(deleteAllUsersQuerySchema.safeParse({ confirm: 'true' }).success).toBe(true);
    });
  });
});
