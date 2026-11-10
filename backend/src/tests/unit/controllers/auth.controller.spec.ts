import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { SESSION_COOKIE_NAME } from '../../../config/session';
import { AuthController } from '../../../controllers/auth.controller';
import { UnauthorizedError } from '../../../errors/app-error';
import type { AuthService } from '../../../services/auth.service';

const user = { id: 'u1', name: 'Admin', email: 'admin@crud.dev' };
const expires = new Date('2026-11-08T15:30:00.000Z');

const makeResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/** Simula os métodos que o Passport e o express-session adicionam à requisição. */
const makeRequest = (overrides: Record<string, unknown> = {}) =>
  ({
    body: {},
    user: undefined,
    session: {
      cookie: { expires },
      destroy: jest.fn((callback: (error?: unknown) => void) => callback()),
    },
    login: jest.fn((_user: unknown, callback: (error?: unknown) => void) => callback()),
    logout: jest.fn((callback: (error?: unknown) => void) => callback()),
    ...overrides,
  }) as unknown as Request;

describe('AuthController', () => {
  let authService: jest.Mocked<AuthService>;
  let controller: AuthController;

  beforeEach(() => {
    authService = {
      validateCredentials: jest.fn(),
      findSessionUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
    controller = new AuthController(authService);
  });

  describe('login', () => {
    it('valida as credenciais, inicia a sessão e informa a expiração', async () => {
      authService.validateCredentials.mockResolvedValue(user);
      const req = makeRequest({ body: { email: ' ADMIN@crud.dev ', password: 'Admin@123' } });
      const res = makeResponse();

      await controller.login(req, res);

      expect(authService.validateCredentials).toHaveBeenCalledWith({
        email: 'admin@crud.dev',
        password: 'Admin@123',
      });
      expect(req.login).toHaveBeenCalledWith(user, expect.any(Function));
      expect(res.json).toHaveBeenCalledWith({ user, expiresAt: expires.toISOString() });
    });

    it('rejeita corpo inválido sem consultar o service', async () => {
      const req = makeRequest({ body: { email: 'invalido' } });

      await expect(controller.login(req, makeResponse())).rejects.toBeInstanceOf(ZodError);
      expect(authService.validateCredentials).not.toHaveBeenCalled();
    });

    it('não cria sessão quando as credenciais são inválidas', async () => {
      authService.validateCredentials.mockRejectedValue(new UnauthorizedError());
      const req = makeRequest({ body: { email: 'admin@crud.dev', password: 'errada' } });

      await expect(controller.login(req, makeResponse())).rejects.toBeInstanceOf(
        UnauthorizedError,
      );
      expect(req.login).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('retorna o usuário da sessão', async () => {
      const res = makeResponse();

      await controller.me(makeRequest({ user }), res);

      expect(res.json).toHaveBeenCalledWith({ user, expiresAt: expires.toISOString() });
    });

    it('lança 401 sem usuário na sessão', async () => {
      await expect(controller.me(makeRequest(), makeResponse())).rejects.toBeInstanceOf(
        UnauthorizedError,
      );
    });
  });

  describe('logout', () => {
    it('encerra a sessão, remove o cookie e responde 204', async () => {
      const req = makeRequest({ user });
      const res = makeResponse();

      await controller.logout(req, res);

      expect(req.logout).toHaveBeenCalled();
      expect(req.session.destroy).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
