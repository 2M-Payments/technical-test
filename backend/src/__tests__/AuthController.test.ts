import 'reflect-metadata';
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';

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
    it('deve chamar o service e retornar 201 com os dados do usuário em caso de sucesso', async () => {
      const mockReq = {
        body: { name: 'New User', email: 'new@example.com', password: 'password123' },
      } as Request;
      const mockRes = makeMockRes();
      const expectedUser = { id: 'uuid', name: 'New User', email: 'new@example.com' };
      
      mockAuthService.register.mockResolvedValue(expectedUser);

      await controller.register(mockReq, mockRes);

      expect(mockAuthService.register).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expectedUser);
    });

    it('deve retornar 400 se o Zod Schema falhar a validação', async () => {
        const mockReq = { body: { email: 'invalid-email' } } as Request;
        const mockRes = makeMockRes();
        
        await controller.register(mockReq, mockRes);
  
        expect(mockAuthService.register).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalled();
    });

    it('deve retornar 400 se o serviço lançar um erro', async () => {
      const mockReq = {
        body: { name: 'Test', email: 'test@example.com', password: 'password123' },
      } as Request;
      const mockRes = makeMockRes();
      const serviceError = new Error('Email já cadastrado');

      mockAuthService.register.mockRejectedValue(serviceError);

      await controller.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: serviceError.message });
    });
  });

  describe('login', () => {
    it('deve chamar o service e retornar 200 com o token em caso de sucesso', async () => {
      const mockReq = { body: { email: 'user@example.com', password: 'password123' } } as Request;
      const mockRes = makeMockRes();
      const expectedResult = { token: 'fake-jwt-token' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      await controller.login(mockReq, mockRes);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockReq.body);
     
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });

    it('deve retornar 401 se o serviço lançar um erro', async () => {
        const mockReq = { body: { email: 'user@example.com', password: 'wrongpassword' } } as Request;
        const mockRes = makeMockRes();
        const serviceError = new Error('Credenciais inválidas');

        mockAuthService.login.mockRejectedValue(serviceError);

        await controller.login(mockReq, mockRes);

        expect(mockAuthService.login).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: serviceError.message });
    });
  });
});
