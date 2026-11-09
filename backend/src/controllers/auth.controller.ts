import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { SESSION_COOKIE_NAME } from '../config/session';
import { getAuthenticatedUser } from '../utils/get-authenticated-user';
import type { AuthenticatedUser } from '../dtos/authenticated-user.dto';
import { loginSchema } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

const sessionExpiresAt = (req: Request): string | null =>
  req.session.cookie.expires?.toISOString() ?? null;

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    const user = await this.authService.validateCredentials(input);

    // req.login (Passport >= 0.6) regenera o ID da sessão, evitando session fixation.
    await new Promise<void>((resolve, reject) => {
      req.login(user, (error: unknown) => (error ? reject(error) : resolve()));
    });

    res.json({ user, expiresAt: sessionExpiresAt(req) });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user: AuthenticatedUser = getAuthenticatedUser(req);
    res.json({ user, expiresAt: sessionExpiresAt(req) });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
      req.logout((error: unknown) => (error ? reject(error) : resolve()));
    });
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error: unknown) => (error ? reject(error) : resolve()));
    });

    res.clearCookie(SESSION_COOKIE_NAME);
    res.status(204).send();
  };
}
