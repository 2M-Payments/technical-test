/** Dados mínimos do usuário mantidos em `req.user` durante a sessão. */
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}
