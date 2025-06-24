import { errorHandler } from '../../middlewares/errorHandlerMiddleware';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

describe('errorHandler middleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 400 se o erro for uma ZodError', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['email'],
        message: 'Expected string, received number',
      },
    ]);

    errorHandler(zodError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Erro de validação nos dados enviados.',
      errors: zodError.flatten().fieldErrors,
    });
  });

  it('deve retornar 500 com a mensagem do erro', () => {
    const error = new Error('Erro inesperado');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Erro inesperado',
    });
  });
});
