import type { Region } from '../entities/region.entity';
import type { UserSortableField } from '../dtos/user.dto';
import type { UserStatus } from '../entities/user-status.enum';
import type { User } from '../entities/user.entity';

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  regionCode?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: UserSortableField;
  sortOrder: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  regions: Region[];
}

export type UpdateUserData = Partial<CreateUserData>;

export interface IUsersRepository {
  create(data: CreateUserData): Promise<User>;
  createMany(data: CreateUserData[]): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string, options?: { withPassword?: boolean }): Promise<User | null>;
  findExistingEmails(emails: string[]): Promise<string[]>;
  findPaginated(filters: UserFilters, pagination: PaginationOptions): Promise<PaginatedResult<User>>;
  update(user: User, data: UpdateUserData): Promise<User>;
  deleteById(id: string): Promise<boolean>;
  deleteByIds(ids: string[]): Promise<number>;
  /** Remove todos os usuários, exceto os IDs informados (ex.: o usuário logado). */
  deleteAll(exceptIds?: string[]): Promise<number>;
}
