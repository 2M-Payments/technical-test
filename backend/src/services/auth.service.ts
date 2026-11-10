import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../config/tokens';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';
import type { IHashProvider } from '../providers/hash/hash-provider.interface';
import { UserStatus } from '../entities/user-status.enum';
import type { User } from '../entities/user.entity';
import type { IUsersRepository } from '../repositories/users-repository.interface';
import type { AuthenticatedUser } from '../dtos/authenticated-user.dto';
import type { LoginInput } from '../dtos/auth.dto';

const toAuthenticatedUser = ({ id, name, email }: User): AuthenticatedUser => ({ id, name, email });

@injectable()
export class AuthService {
  constructor(
    @inject(TOKENS.UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @inject(TOKENS.HashProvider)
    private readonly hashProvider: IHashProvider,
  ) {}

  async validateCredentials({ email, password }: LoginInput): Promise<AuthenticatedUser> {
    const user = await this.usersRepository.findByEmail(email, { withPassword: true });
    const passwordMatches = user
      ? await this.hashProvider.compare(password, user.passwordHash)
      : false;

    // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem.
    if (!user || !passwordMatches) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenError('Usuário inativo ou pendente de aprovação');
    }

    return toAuthenticatedUser(user);
  }

  /** Usado a cada requisição para reidratar a sessão; invalida usuários removidos ou inativos. */
  async findSessionUser(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.status !== UserStatus.ACTIVE) return null;
    return toAuthenticatedUser(user);
  }
}
