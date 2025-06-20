import 'reflect-metadata';
import { container } from 'tsyringe';
import { Repository } from 'typeorm';
import { AuthService } from '../services/AuthService';
import { User } from '../entities/User';
import * as hashUtils from '../utils/hash';
import * as jwtUtils from '../utils/jwt';   

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    jest.clearAllMocks();

    authService = container.resolve(AuthService);
    mockUserRepository = container.resolve('UserRepository') as jest.Mocked<Repository<User>>;
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const input = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashed_password';

      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...input, password: hashedPassword } as User);
      mockUserRepository.save.mockResolvedValue({} as User);

      const hashSpy = jest.spyOn(hashUtils, 'hashPassword').mockResolvedValue(hashedPassword);

      const result = await authService.register(input);

      expect(result).toBeDefined();
      expect(result.email).toBe(input.email);
      expect(result).not.toHaveProperty('password'); 
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: input.email });
      expect(hashSpy).toHaveBeenCalledWith(input.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ ...input, password: hashedPassword });
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar um erro se o email já estiver cadastrado', async () => {
      const input = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      mockUserRepository.findOneBy.mockResolvedValue({ id: 'some-id', ...input } as User);

    
      await expect(authService.register(input)).rejects.toThrow('Email já cadastrado');
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('deve logar um usuário com sucesso e retornar um token', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const user = { id: 'user-id', email: input.email, password: 'hashed_password' } as User;
      const token = 'fake-jwt-token';

      mockUserRepository.findOneBy.mockResolvedValue(user);
      const compareSpy = jest.spyOn(hashUtils, 'comparePasswords').mockResolvedValue(true);
      const signSpy = jest.spyOn(jwtUtils, 'signToken').mockReturnValue(token);

      const result = await authService.login(input);

      expect(result).toEqual({ token });
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: input.email });
      expect(compareSpy).toHaveBeenCalledWith(input.password, user.password);
      expect(signSpy).toHaveBeenCalledWith({ sub: user.id });
    });

    it('deve lançar um erro para credenciais inválidas (usuário não encontrado)', async () => {
      const input = { email: 'wrong@example.com', password: 'password123' };
      mockUserRepository.findOneBy.mockResolvedValue(null);
      const compareSpy = jest.spyOn(hashUtils, 'comparePasswords');


      await expect(authService.login(input)).rejects.toThrow('Credenciais inválidas');
      expect(compareSpy).not.toHaveBeenCalled();
    });

    it('deve lançar um erro para credenciais inválidas (senha incorreta)', async () => {
      const input = { email: 'test@example.com', password: 'wrong_password' };
      const user = { id: 'user-id', email: input.email, password: 'hashed_password' } as User;

      mockUserRepository.findOneBy.mockResolvedValue(user);
      jest.spyOn(hashUtils, 'comparePasswords').mockResolvedValue(false);

      await expect(authService.login(input)).rejects.toThrow('Credenciais inválidas');
    });
  });
});
