import type { RequestHandler } from 'express';

import { UnauthorizedError } from '../errors/app-error';

export const SESSION_EXPIRES_HEADER = 'X-Session-Expires-At';

/**
 * Bloqueia requisições sem sessão válida e informa ao cliente, via header,
 * quando a sessão (renovada por esta requisição) vai expirar.
 */
export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(new UnauthorizedError('Sessão inválida ou expirada'));
    return;
  }

  const expiresAt = req.session.cookie.expires;
  if (expiresAt) res.setHeader(SESSION_EXPIRES_HEADER, expiresAt.toISOString());

  next();
};
