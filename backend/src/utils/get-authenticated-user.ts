import type { Request } from 'express';

import { UnauthorizedError } from '../errors/app-error';
import type { AuthenticatedUser } from '../dtos/authenticated-user.dto';

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}
