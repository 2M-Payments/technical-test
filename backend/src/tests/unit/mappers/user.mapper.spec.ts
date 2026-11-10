import { UserStatus } from '../../../entities/user-status.enum';
import { User } from '../../../entities/user.entity';
import { toUserResponse } from '../../../mappers/user.mapper';
import { makeRegion } from '../../fakes/in-memory-regions.repository';

describe('toUserResponse', () => {
  const createdAt = new Date('2026-11-08T12:00:00.000Z');

  const makeUser = (overrides: Partial<User> = {}): User =>
    Object.assign(new User(), {
      id: 'u1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      passwordHash: 'hash-secreto',
      status: UserStatus.ACTIVE,
      regions: [makeRegion(2, 'GB', 'Reino Unido'), makeRegion(1, 'BR', 'Brasil')],
      createdAt,
      updatedAt: createdAt,
      ...overrides,
    });

  it('expõe apenas os campos públicos, sem o hash de senha', () => {
    const response = toUserResponse(makeUser());

    expect(response).toEqual({
      id: 'u1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: UserStatus.ACTIVE,
      regions: [
        { code: 'BR', name: 'Brasil' },
        { code: 'GB', name: 'Reino Unido' },
      ],
      createdAt,
      updatedAt: createdAt,
    });
    expect(response).not.toHaveProperty('passwordHash');
  });

  it('retorna lista vazia quando as regiões não foram carregadas', () => {
    const user = makeUser();
    Reflect.deleteProperty(user, 'regions');

    expect(toUserResponse(user).regions).toEqual([]);
  });
});
