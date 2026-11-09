import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { AppError, NotFoundError } from '../../../errors/app-error';
import {
  errorHandler,
  notFoundHandler,
} from '../../../middlewares/error-handler.middleware';

const makeResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const req = { method: 'GET', originalUrl: '/api/nada' } as Request;
const next = jest.fn() as NextFunction;

describe('errorHandler', () => {
  it('converte ZodError em 400 com a lista de campos inválidos', () => {
    const res = makeResponse();
    const result = z.object({ email: z.string().email('E-mail inválido') }).safeParse({ email: 'x' });

    errorHandler(result.error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dados inválidos',
      issues: [{ path: 'email', message: 'E-mail inválido' }],
    });
  });

  it('usa o status e os detalhes de um AppError', () => {
    const res = makeResponse();

    errorHandler(new AppError('Região inválida', 400, { regionCodes: ['XX'] }), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Região inválida',
      details: { regionCodes: ['XX'] },
    });
  });

  it('responde 500 sem vazar detalhes de erros inesperados', () => {
    const res = makeResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(new Error('senha do banco: 123'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor' });
    consoleSpy.mockRestore();
  });
});

describe('notFoundHandler', () => {
  it('encaminha um NotFoundError com a rota requisitada', () => {
    const nextSpy = jest.fn();

    notFoundHandler(req, makeResponse(), nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(expect.any(NotFoundError));
    expect(nextSpy.mock.calls[0][0].message).toBe('Rota GET /api/nada não encontrada');
  });
});
