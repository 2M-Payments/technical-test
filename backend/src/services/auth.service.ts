import { UserRepository } from '../repositories/User.repository';
import bcrypt from 'bcrypt';
import { LoginSchema } from '../validation/auth.validation';

export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async login(data: unknown): Promise<{ id: string; email: string; name: string }> {
    const validated = LoginSchema.parse(data);

    const user = await this.userRepository.findByEmail(validated.email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(validated.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }
}
