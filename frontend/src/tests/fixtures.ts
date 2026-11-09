import type { Region, User } from '../types/user';

export const regionsFixture: Region[] = [
  { code: 'BR', name: 'Brasil' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'US', name: 'Estados Unidos' },
];

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: '6f1c1a8e-0000-4000-8000-000000000001',
  name: 'Maria Silva',
  email: 'maria@email.com',
  status: 'ACTIVE',
  regions: [regionsFixture[0], regionsFixture[1]],
  createdAt: '2026-10-26T12:00:00.000Z',
  updatedAt: '2026-10-26T12:00:00.000Z',
  ...overrides,
});
