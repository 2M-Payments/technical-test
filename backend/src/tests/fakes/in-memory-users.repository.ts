import { randomUUID } from 'node:crypto';

import { User } from '../../entities/user.entity';
import type {
  CreateUserData,
  IUsersRepository,
  PaginatedResult,
  PaginationOptions,
  UpdateUserData,
  UserFilters,
} from '../../repositories/users-repository.interface';

/**
 * Implementação em memória do contrato do repositório. Permite testar os
 * services sem banco, reforçando que eles dependem apenas da interface.
 */
export class InMemoryUsersRepository implements IUsersRepository {
  users: User[] = [];
  private clock = new Date('2026-01-01T00:00:00Z').getTime();

  async create(data: CreateUserData): Promise<User> {
    const now = new Date((this.clock += 1000));
    const user = Object.assign(new User(), {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
    this.users.push(user);
    return user;
  }

  async createMany(data: CreateUserData[]): Promise<User[]> {
    const created: User[] = [];
    for (const item of data) created.push(await this.create(item));
    return created;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findExistingEmails(emails: string[]): Promise<string[]> {
    return this.users.filter((user) => emails.includes(user.email)).map((user) => user.email);
  }

  async findPaginated(
    filters: UserFilters,
    { page, limit, sortBy, sortOrder }: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const search = filters.search?.toLowerCase();
    const filtered = this.users.filter(
      (user) =>
        (!filters.status || user.status === filters.status) &&
        (!filters.regionCode || user.regions.some((r) => r.code === filters.regionCode)) &&
        (!filters.createdFrom || user.createdAt >= filters.createdFrom) &&
        (!filters.createdTo || user.createdAt <= filters.createdTo) &&
        (!search ||
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)),
    );

    const direction = sortOrder === 'ASC' ? 1 : -1;
    const sortKey = (user: User): string => {
      const value = user[sortBy];
      return value instanceof Date ? value.toISOString() : value;
    };
    const sorted = [...filtered].sort((a, b) => {
      const [left, right] = [sortKey(a), sortKey(b)];
      return (left < right ? -1 : left > right ? 1 : 0) * direction;
    });

    const start = (page - 1) * limit;
    return { items: sorted.slice(start, start + limit), total: filtered.length };
  }

  async update(user: User, data: UpdateUserData): Promise<User> {
    Object.assign(user, data, { updatedAt: new Date((this.clock += 1000)) });
    return user;
  }

  async deleteById(id: string): Promise<boolean> {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < before;
  }

  async deleteByIds(ids: string[]): Promise<number> {
    const before = this.users.length;
    this.users = this.users.filter((user) => !ids.includes(user.id));
    return before - this.users.length;
  }

  async deleteAll(exceptIds: string[] = []): Promise<number> {
    return this.deleteByIds(
      this.users.filter((user) => !exceptIds.includes(user.id)).map((user) => user.id),
    );
  }
}
