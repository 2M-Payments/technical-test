import type { Request, Response } from 'express';

import {
  ensureAuthenticated,
  SESSION_EXPIRES_HEADER,
} from '../../../middlewares/ensure-authenticated.middleware';
import { UnauthorizedError } from '../../../errors/app-error';

const makeRequest = (authenticated: boolean, expires?: Date) =>
  ({
    isAuthenticated: () => authenticated,
    session: { cookie: { expires } },
  }) as unknown as Request;

describe('ensureAuthenticated', () => {
  it('bloqueia requisições sem sessão com 401', () => {
    const next = jest.fn();

    ensureAuthenticated(makeRequest(false), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('libera requisições autenticadas e informa a expiração da sessão', () => {
    const next = jest.fn();
    const res = { setHeader: jest.fn() } as unknown as Response;
    const expires = new Date('2026-10-27T03:30:00.000Z');

    ensureAuthenticated(makeRequest(true, expires), res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.setHeader).toHaveBeenCalledWith(SESSION_EXPIRES_HEADER, expires.toISOString());
  });
});
