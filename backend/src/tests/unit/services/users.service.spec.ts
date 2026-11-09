import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../../errors/app-error';
import { UserStatus } from '../../../entities/user-status.enum';
import type { CreateUserInput } from '../../../dtos/user.dto';
import { UsersService } from '../../../services/users.service';
import { FakeHashProvider } from '../../fakes/fake-hash.provider';
import { InMemoryRegionsRepository } from '../../fakes/in-memory-regions.repository';
import { InMemoryUsersRepository } from '../../fakes/in-memory-users.repository';

const makeInput = (overrides: Partial<CreateUserInput> = {}): CreateUserInput => ({
  name: 'Maria Silva',
  email: 'maria@email.com',
  password: 'senha-segura',
  status: UserStatus.ACTIVE,
  regionCodes: ['BR', 'GB'],
  ...overrides,
});

const CURRENT_USER_ID = '6f1c1a8e-0000-4000-8000-0000000000ff';

const listQuery = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt' as const,
  sortOrder: 'ASC' as const,
};

describe('UsersService', () => {
  let usersRepository: InMemoryUsersRepository;
  let hashProvider: FakeHashProvider;
  let service: UsersService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hashProvider = new FakeHashProvider();
    service = new UsersService(usersRepository, new InMemoryRegionsRepository(), hashProvider);
  });

  describe('create', () => {
    it('cria um usuário em múltiplas regiões sem expor a senha', async () => {
      const user = await service.create(makeInput());

      expect(user).toMatchObject({ name: 'Maria Silva', email: 'maria@email.com' });
      expect(user.regions).toEqual([
        { code: 'BR', name: 'Brasil' },
        { code: 'GB', name: 'Reino Unido' },
      ]);
      expect(user).not.toHaveProperty('passwordHash');
      expect(usersRepository.users[0].passwordHash).toBe('hashed:senha-segura');
    });

    it('rejeita e-mail já cadastrado', async () => {
      await service.create(makeInput());

      await expect(service.create(makeInput({ name: 'Outra Maria' }))).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it('rejeita códigos de região inexistentes informando quais são', async () => {
      const promise = service.create(makeInput({ regionCodes: ['BR', 'XX'] }));

      await expect(promise).rejects.toBeInstanceOf(AppError);
      await expect(promise).rejects.toMatchObject({
        statusCode: 400,
        details: { regionCodes: ['XX'] },
      });
      expect(usersRepository.users).toHaveLength(0);
    });
  });

  describe('createMany', () => {
    it('cria vários usuários em lote', async () => {
      const users = await service.createMany({
        users: [
          makeInput({ email: 'a@email.com' }),
          makeInput({ email: 'b@email.com', regionCodes: ['US'] }),
        ],
      });

      expect(users).toHaveLength(2);
      expect(users[1].regions).toEqual([{ code: 'US', name: 'Estados Unidos' }]);
    });

    it('não cria nenhum usuário se algum e-mail já existir', async () => {
      await service.create(makeInput({ email: 'existente@email.com' }));

      await expect(
        service.createMany({
          users: [makeInput({ email: 'novo@email.com' }), makeInput({ email: 'existente@email.com' })],
        }),
      ).rejects.toMatchObject({ statusCode: 409, details: { emails: ['existente@email.com'] } });
      expect(usersRepository.users).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('retorna o usuário pelo ID', async () => {
      const created = await service.create(makeInput());

      await expect(service.findById(created.id)).resolves.toMatchObject({ id: created.id });
    });

    it('lança NotFoundError para ID inexistente', async () => {
      await expect(
        service.findById('6f1c1a8e-0000-4000-8000-000000000000'),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      await service.createMany({
        users: [
          makeInput({ email: 'ana@email.com', name: 'Ana', regionCodes: ['BR'] }),
          makeInput({
            email: 'bob@email.com',
            name: 'Bob',
            regionCodes: ['GB'],
            status: UserStatus.INACTIVE,
          }),
          makeInput({ email: 'caio@email.com', name: 'Caio', regionCodes: ['BR', 'GB'] }),
        ],
      });
    });

    it('pagina os resultados e calcula os metadados', async () => {
      const result = await service.list({ ...listQuery, limit: 2, page: 2 });

      expect(result.meta).toEqual({ page: 2, limit: 2, total: 3, totalPages: 2 });
      expect(result.data.map((u) => u.name)).toEqual(['Caio']);
    });

    it('filtra por status', async () => {
      const result = await service.list({ ...listQuery, status: UserStatus.INACTIVE });

      expect(result.data.map((u) => u.name)).toEqual(['Bob']);
    });

    it('filtra por região mantendo todas as regiões do usuário', async () => {
      const result = await service.list({ ...listQuery, regionCode: 'GB' });

      expect(result.data.map((u) => u.name)).toEqual(['Bob', 'Caio']);
      expect(result.data[1].regions.map((r) => r.code)).toEqual(['BR', 'GB']);
    });

    it('filtra por período de criação', async () => {
      const [, bob] = usersRepository.users;

      const result = await service.list({
        ...listQuery,
        createdFrom: bob.createdAt,
        createdTo: bob.createdAt,
      });

      expect(result.data.map((u) => u.name)).toEqual(['Bob']);
    });
  });

  describe('update', () => {
    it('atualiza apenas os campos informados', async () => {
      const created = await service.create(makeInput());

      const updated = await service.update(created.id, {
        name: 'Maria Souza',
        regionCodes: ['US'],
      });

      expect(updated).toMatchObject({ name: 'Maria Souza', email: 'maria@email.com' });
      expect(updated.regions).toEqual([{ code: 'US', name: 'Estados Unidos' }]);
    });

    it('gera novo hash quando a senha é alterada', async () => {
      const created = await service.create(makeInput());
      const hashSpy = jest.spyOn(hashProvider, 'hash');

      await service.update(created.id, { password: 'nova-senha-123' });

      expect(hashSpy).toHaveBeenCalledWith('nova-senha-123');
      expect(usersRepository.users[0].passwordHash).toBe('hashed:nova-senha-123');
    });

    it('impede usar o e-mail de outro usuário', async () => {
      const maria = await service.create(makeInput());
      await service.create(makeInput({ email: 'joao@email.com' }));

      await expect(service.update(maria.id, { email: 'joao@email.com' })).rejects.toBeInstanceOf(
        ConflictError,
      );
    });

    it('lança NotFoundError ao atualizar usuário inexistente', async () => {
      await expect(
        service.update('6f1c1a8e-0000-4000-8000-000000000000', { name: 'Nome' }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('delete', () => {
    it('remove um usuário pelo ID', async () => {
      const created = await service.create(makeInput());

      await service.delete(created.id, CURRENT_USER_ID);

      expect(usersRepository.users).toHaveLength(0);
    });

    it('impede que o usuário logado exclua a si mesmo', async () => {
      const created = await service.create(makeInput());

      await expect(service.delete(created.id, created.id)).rejects.toBeInstanceOf(ForbiddenError);
      expect(usersRepository.users).toHaveLength(1);
    });

    it('lança NotFoundError ao remover usuário inexistente', async () => {
      await expect(
        service.delete('6f1c1a8e-0000-4000-8000-000000000000', CURRENT_USER_ID),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('remove vários usuários por ID e informa a quantidade', async () => {
      const users = await service.createMany({
        users: ['a', 'b', 'c'].map((n) => makeInput({ email: `${n}@email.com` })),
      });

      const result = await service.deleteMany([users[0].id, users[2].id], CURRENT_USER_ID);

      expect(result).toEqual({ deleted: 2 });
      expect(usersRepository.users.map((u) => u.email)).toEqual(['b@email.com']);
    });

    it('ignora o usuário logado na exclusão em lote', async () => {
      const users = await service.createMany({
        users: ['a', 'b'].map((n) => makeInput({ email: `${n}@email.com` })),
      });

      const result = await service.deleteMany([users[0].id, users[1].id], users[0].id);

      expect(result).toEqual({ deleted: 1 });
      expect(usersRepository.users.map((u) => u.id)).toEqual([users[0].id]);
    });

    it('remove todos os usuários exceto o usuário logado', async () => {
      const users = await service.createMany({
        users: ['a', 'b', 'c'].map((n) => makeInput({ email: `${n}@email.com` })),
      });

      const result = await service.deleteAll(users[1].id);

      expect(result).toEqual({ deleted: 2 });
      expect(usersRepository.users.map((u) => u.id)).toEqual([users[1].id]);
    });
  });
});
