import { AuthService } from '../../../services/auth.service';
import { UserStatus } from '../../../entities/user-status.enum';
import { ForbiddenError, UnauthorizedError } from '../../../errors/app-error';
import { FakeHashProvider } from '../../fakes/fake-hash.provider';
import { InMemoryUsersRepository } from '../../fakes/in-memory-users.repository';

describe('AuthService', () => {
  let usersRepository: InMemoryUsersRepository;
  let service: AuthService;

  const createUser = (status = UserStatus.ACTIVE) =>
    usersRepository.create({
      name: 'Admin',
      email: 'admin@crud.dev',
      passwordHash: 'hashed:Admin@123',
      status,
      regions: [],
    });

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    service = new AuthService(usersRepository, new FakeHashProvider());
  });

  describe('validateCredentials', () => {
    it('retorna apenas os dados públicos do usuário com credenciais válidas', async () => {
      const user = await createUser();

      await expect(
        service.validateCredentials({ email: 'admin@crud.dev', password: 'Admin@123' }),
      ).resolves.toEqual({ id: user.id, name: 'Admin', email: 'admin@crud.dev' });
    });

    it.each([
      ['senha incorreta', 'admin@crud.dev', 'errada'],
      ['e-mail inexistente', 'ninguem@crud.dev', 'Admin@123'],
    ])('rejeita %s com a mesma mensagem genérica', async (_caso, email, password) => {
      await createUser();

      const promise = service.validateCredentials({ email, password });

      await expect(promise).rejects.toBeInstanceOf(UnauthorizedError);
      await expect(promise).rejects.toThrow('E-mail ou senha inválidos');
    });

    it('bloqueia usuário inativo', async () => {
      await createUser(UserStatus.INACTIVE);

      await expect(
        service.validateCredentials({ email: 'admin@crud.dev', password: 'Admin@123' }),
      ).rejects.toBeInstanceOf(ForbiddenError);
    });
  });

  describe('findSessionUser', () => {
    it('reidrata o usuário ativo da sessão', async () => {
      const user = await createUser();

      await expect(service.findSessionUser(user.id)).resolves.toMatchObject({ id: user.id });
    });

    it('invalida a sessão de usuário removido ou inativo', async () => {
      const inactive = await createUser(UserStatus.INACTIVE);

      await expect(service.findSessionUser(inactive.id)).resolves.toBeNull();
      await expect(service.findSessionUser('removido')).resolves.toBeNull();
    });
  });
});
