import { authGuard } from '../../middlewares/authMiddleware';
import { verifyToken } from '../../utils/jwt';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../utils/jwt');

describe('authGuard middleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se o token não for fornecido', () => {
    mockReq.headers = {};
    
    authGuard(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Token não fornecido ou mal formatado.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o token estiver mal formatado', () => {
    mockReq.headers = { authorization: 'Token xyz' };

    authGuard(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Token não fornecido ou mal formatado.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o token for inválido', () => {
    mockReq.headers = { authorization: 'Bearer token.invalido' };
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    authGuard(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Token inválido ou expirado.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve adicionar req.user e chamar next() se o token for válido', () => {
    mockReq.headers = { authorization: 'Bearer token.valido' };
    (verifyToken as jest.Mock).mockReturnValue({ sub: 'user-123' });

    authGuard(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual({ id: 'user-123' });
    expect(mockNext).toHaveBeenCalled();
  });
});
