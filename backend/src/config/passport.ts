import passport from 'passport';
import { container } from 'tsyringe';

import { AuthService } from '../services/auth.service';

/**
 * Passport cuida da sessão: grava apenas o ID do usuário no store e
 * reidrata `req.user` a cada requisição.
 */
export function configurePassport(): void {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser<string>((id, done) => {
    container
      .resolve(AuthService)
      .findSessionUser(id)
      .then((user) => done(null, user ?? false))
      .catch(done);
  });
}
