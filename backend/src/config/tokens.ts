/**
 * Tokens de injeção. Usar símbolos (e não as classes concretas) permite
 * depender de interfaces e trocar implementações nos testes.
 */
export const TOKENS = {
  DataSource: Symbol('DataSource'),
  UsersRepository: Symbol('UsersRepository'),
  RegionsRepository: Symbol('RegionsRepository'),
  HashProvider: Symbol('HashProvider'),
} as const;
