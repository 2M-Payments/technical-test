import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { LoginSchema } from '../validation/auth.validation';
import { JwtUtil } from '../utils/jwt.util';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  expiresIn: string;
}

export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async login(data: unknown): Promise<LoginResponse> {
    const validated = LoginSchema.parse(data);

    const user = await this.userRepository.findByEmail(validated.email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(validated.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token,
      expiresIn: '30m'
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = JwtUtil.verifyToken(token);
      
      // Verificar se usuário ainda existe
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        userId: decoded.userId,
        email: decoded.email,
        name: user.name
      };
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}