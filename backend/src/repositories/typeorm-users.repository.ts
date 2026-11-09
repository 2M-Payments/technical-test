import { DataSource, In, type Repository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../config/tokens';
import { User } from '../entities/user.entity';
import type {
  CreateUserData,
  IUsersRepository,
  PaginatedResult,
  PaginationOptions,
  UpdateUserData,
  UserFilters,
} from './users-repository.interface';

/** Escapa curingas do LIKE para que a busca trate `%` e `_` como texto. */
const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (char) => `\\${char}`);

@injectable()
export class TypeOrmUsersRepository implements IUsersRepository {
  private readonly repository: Repository<User>;

  constructor(@inject(TOKENS.DataSource) dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  create(data: CreateUserData): Promise<User> {
    return this.repository.save(this.repository.create(data));
  }

  /** `save` com array roda em uma única transação: ou todos são criados, ou nenhum. */
  createMany(data: CreateUserData[]): Promise<User[]> {
    return this.repository.save(data.map((item) => this.repository.create(item)));
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id }, relations: { regions: true } });
  }

  findByEmail(email: string, options: { withPassword?: boolean } = {}): Promise<User | null> {
    const query = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.regions', 'region')
      .where('user.email = :email', { email });

    if (options.withPassword) query.addSelect('user.passwordHash');

    return query.getOne();
  }

  async findExistingEmails(emails: string[]): Promise<string[]> {
    if (emails.length === 0) return [];
    const users = await this.repository.find({ select: { email: true }, where: { email: In(emails) } });
    return users.map((user) => user.email);
  }

  async findPaginated(
    filters: UserFilters,
    { page, limit, sortBy, sortOrder }: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const query = this.repository.createQueryBuilder('user');

    // Join separado para filtrar, mantendo todas as regiões do usuário no retorno.
    if (filters.regionCode) {
      query.innerJoin('user.regions', 'filterRegion', 'filterRegion.code = :regionCode', {
        regionCode: filters.regionCode,
      });
    }
    if (filters.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }
    if (filters.search) {
      query.andWhere('(user.name LIKE :search OR user.email LIKE :search)', {
        search: `%${escapeLike(filters.search)}%`,
      });
    }
    if (filters.createdFrom) {
      query.andWhere('user.createdAt >= :createdFrom', { createdFrom: filters.createdFrom });
    }
    if (filters.createdTo) {
      query.andWhere('user.createdAt <= :createdTo', { createdTo: filters.createdTo });
    }

    // `sortBy` vem de uma whitelist validada pelo Zod.
    const [items, total] = await query
      .leftJoinAndSelect('user.regions', 'region')
      .orderBy(`user.${sortBy}`, sortOrder)
      .addOrderBy('user.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }

  update(user: User, data: UpdateUserData): Promise<User> {
    // Object.assign substitui a lista de regiões por completo (merge do TypeORM mesclaria item a item).
    return this.repository.save(Object.assign(user, data));
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async deleteByIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    const result = await this.repository.delete({ id: In(ids) });
    return result.affected ?? 0;
  }

  async deleteAll(exceptIds: string[] = []): Promise<number> {
    const query = this.repository.createQueryBuilder().delete().from(User);
    if (exceptIds.length > 0) query.where('id NOT IN (:...exceptIds)', { exceptIds });
    const result = await query.execute();
    return result.affected ?? 0;
  }
}
