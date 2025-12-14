
import bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtUtil } from '../utils/jwt.util';
import { User } from '../entities/User.entity';

jest.mock('bcrypt');
jest.mock('../utils/jwt.util');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as any;

    authService = new AuthService(userRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser: Partial<User>= {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      const loginData = {
        email: 'test@test.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (JwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.login(loginData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(JwtUtil.generateToken).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@test.com',
      });
      expect(result).toEqual({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
        },
        token: 'mock-token',
        expiresIn: '30m',
      });
    });

    it('deve lançar erro se usuário não existir', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@test.com', password: 'pass' })
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@test.com', password: 'wrongpass' })
      ).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('verifyToken', () => {
    it('deve verificar token válido', async () => {
      const mockDecoded = { userId: '1', email: 'test@test.com' };
      const mockUser = { id: '1', name: 'Test User', email: 'test@test.com' };

      (JwtUtil.verifyToken as jest.Mock).mockReturnValue(mockDecoded);
      userRepository.findById.mockResolvedValue(mockUser as any);

      const result = await authService.verifyToken('valid-token');

      expect(JwtUtil.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        userId: '1',
        email: 'test@test.com',
        name: 'Test User',
      });
    });

    it('deve lançar erro se token for inválido', async () => {
      (JwtUtil.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken('invalid-token')).rejects.toThrow(
        'Token inválido ou expirado'
      );
    });

    it('deve lançar erro se usuário não existir', async () => {
      const mockDecoded = { userId: '1', email: 'test@test.com' };

      (JwtUtil.verifyToken as jest.Mock).mockReturnValue(mockDecoded);
      userRepository.findById.mockResolvedValue(null);

      await expect(authService.verifyToken('valid-token')).rejects.toThrow(
        'Token inválido ou expirado'
      );
    });
  });
});