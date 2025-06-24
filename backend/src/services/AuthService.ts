import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { hashPassword, comparePasswords } from '../utils/hash';
import { signToken } from '../utils/jwt';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

@injectable()
export class AuthService {
  constructor(
    @inject('UserRepository')
    private userRepository: Repository<User>
  ) {}

  async register({ name, email, password }: RegisterInput) {
    const existing = await this.userRepository.findOneBy({ email });
    if (existing) throw new Error('Email já cadastrado');

    const hashed = await hashPassword(password);
    const user = this.userRepository.create({ name, email, password: hashed });
    await this.userRepository.save(user);

    return { id: user.id, name: user.name, email: user.email };
  }

  async login({ email, password }: LoginInput) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await comparePasswords(password, user.password))) {
      throw new Error('Credenciais inválidas');
    }

    const token = signToken({ sub: user.id });
    return { token };
  }
}
