import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { ZodError } from 'zod';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

const makeMockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, 'resolve').mockReturnValue(mockAuthService as any);
    controller = new AuthController();
  });

  describe('register', () => {
    it('deve registrar um usuário com sucesso', async () => {
      const mockReq = {
        body: { name: 'User', email: 'a@a.com', password: '123456' },
      } as Request;
      const mockRes = makeMockRes();
      const expectedUser = { id: '1', name: 'User', email: 'a@a.com' };

      mockAuthService.register.mockResolvedValue(expectedUser);

      await controller.register(mockReq, mockRes);

      expect(mockAuthService.register).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
    });

    it('deve lançar um ZodError se a validação do schema falhar', async () => {
      const mockReq = { body: { email: 'email-invalido' } } as Request;
      const mockRes = makeMockRes();

      await expect(controller.register(mockReq, mockRes)).rejects.toThrow(ZodError);
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('deve propagar erro se o service lançar exceção', async () => {
      const mockReq = {
        body: { name: 'Test', email: 'test@example.com', password: '123456' },
      } as Request;
      const mockRes = makeMockRes();
      const serviceError = new Error('Email já cadastrado');

      mockAuthService.register.mockRejectedValue(serviceError);

      await expect(controller.register(mockReq, mockRes)).rejects.toThrow('Email já cadastrado');
      expect(mockAuthService.register).toHaveBeenCalledWith(mockReq.body);
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso e retornar token', async () => {
      const mockReq = {
        body: { email: 'user@example.com', password: 'password123' },
      } as Request;
      const mockRes = makeMockRes();
      const expected = { token: 'fake-token' };

      mockAuthService.login.mockResolvedValue(expected);

      await controller.login(mockReq, mockRes);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(expected);
    });

    it('deve lançar um ZodError se o login tiver dados inválidos', async () => {
      const mockReq = { body: { email: 'email-invalido' } } as Request;
      const mockRes = makeMockRes();

      await expect(controller.login(mockReq, mockRes)).rejects.toThrow(ZodError);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('deve propagar erro se o login falhar', async () => {
      const mockReq = {
        body: { email: 'user@example.com', password: 'wrongpassword' },
      } as Request;
      const mockRes = makeMockRes();
      const error = new Error('Credenciais inválidas');

      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockReq, mockRes)).rejects.toThrow('Credenciais inválidas');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockReq.body);
    });
  });
});
