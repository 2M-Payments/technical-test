import type { RequestHandler } from 'express';
import MySQLStoreFactory from 'express-mysql-session';
import session from 'express-session';

import { env } from './env';

export const SESSION_COOKIE_NAME = 'crud.sid';

const sessionTtlMs = () => env.SESSION_TTL_MINUTES * 60 * 1000;

/** Sessões persistidas no próprio MySQL para sobreviverem a restarts da API. */
function createMySqlStore(): session.Store {
  const MySQLStore = MySQLStoreFactory(session);
  return new MySQLStore({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    expiration: sessionTtlMs(),
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
    createDatabaseTable: true,
  });
}

/**
 * Sessão com tempo limite de inatividade (padrão: 30 minutos).
 * `rolling: true` renova o prazo a cada requisição; após 30 minutos sem
 * atividade o cookie e o registro no store expiram e o usuário precisa logar de novo.
 */
export function createSessionMiddleware(): RequestHandler {
  return session({
    name: SESSION_COOKIE_NAME,
    secret: env.SESSION_SECRET,
    store: env.NODE_ENV === 'test' ? undefined : createMySqlStore(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: sessionTtlMs(),
    },
  });
}
