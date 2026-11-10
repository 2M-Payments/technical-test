import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError, NotFoundError } from '../errors/app-error';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Rota ${req.method} ${req.originalUrl} não encontrada`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Dados inválidos',
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
    return;
  }

  // Corpo JSON malformado (lançado pelo express.json()).
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'JSON inválido no corpo da requisição' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
};
