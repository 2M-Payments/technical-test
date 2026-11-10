import type { AuthenticatedUser } from '../dtos/authenticated-user.dto';

declare global {
  namespace Express {
    // Passport tipa `req.user` como `Express.User`; aqui definimos seu formato.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends AuthenticatedUser {}
  }
}

export {};
