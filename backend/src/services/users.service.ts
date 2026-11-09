import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../config/tokens';
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../errors/app-error';
import type { IHashProvider } from '../providers/hash/hash-provider.interface';
import type { Region } from '../entities/region.entity';
import type { IRegionsRepository } from '../repositories/regions-repository.interface';
import type {
  BulkCreateUsersInput,
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
} from '../dtos/user.dto';
import { toUserResponse, type UserResponse } from '../mappers/user.mapper';
import type {
  CreateUserData,
  IUsersRepository,
  UpdateUserData,
} from '../repositories/users-repository.interface';

export interface PaginatedUsersResponse {
  data: UserResponse[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface DeleteResult {
  deleted: number;
}

@injectable()
export class UsersService {
  constructor(
    @inject(TOKENS.UsersRepository)
    private readonly usersRepository: IUsersRepository,
    @inject(TOKENS.RegionsRepository)
    private readonly regionsRepository: IRegionsRepository,
    @inject(TOKENS.HashProvider)
    private readonly hashProvider: IHashProvider,
  ) {}

  async create(input: CreateUserInput): Promise<UserResponse> {
    if (await this.usersRepository.findByEmail(input.email)) {
      throw new ConflictError('E-mail já cadastrado', { emails: [input.email] });
    }

    const regionsByCode = await this.loadRegions(input.regionCodes);
    const user = await this.usersRepository.create(await this.toCreateData(input, regionsByCode));

    return toUserResponse(user);
  }

  async createMany({ users }: BulkCreateUsersInput): Promise<UserResponse[]> {
    const existingEmails = await this.usersRepository.findExistingEmails(users.map((u) => u.email));
    if (existingEmails.length > 0) {
      throw new ConflictError('Alguns e-mails já estão cadastrados', { emails: existingEmails });
    }

    const regionsByCode = await this.loadRegions(users.flatMap((user) => user.regionCodes));
    const data = await Promise.all(users.map((user) => this.toCreateData(user, regionsByCode)));
    const created = await this.usersRepository.createMany(data);

    return created.map(toUserResponse);
  }

  async findById(id: string): Promise<UserResponse> {
    return toUserResponse(await this.getUserOrFail(id));
  }

  async list(query: ListUsersQuery): Promise<PaginatedUsersResponse> {
    const { page, limit, sortBy, sortOrder, ...filters } = query;
    const { items, total } = await this.usersRepository.findPaginated(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      data: items.map(toUserResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, input: UpdateUserInput): Promise<UserResponse> {
    const user = await this.getUserOrFail(id);
    const data: UpdateUserData = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.status !== undefined) data.status = input.status;

    if (input.email !== undefined && input.email !== user.email) {
      const owner = await this.usersRepository.findByEmail(input.email);
      if (owner && owner.id !== id) {
        throw new ConflictError('E-mail já cadastrado', { emails: [input.email] });
      }
      data.email = input.email;
    }

    if (input.password !== undefined) {
      data.passwordHash = await this.hashProvider.hash(input.password);
    }

    if (input.regionCodes !== undefined) {
      const regionsByCode = await this.loadRegions(input.regionCodes);
      data.regions = this.pickRegions(input.regionCodes, regionsByCode);
    }

    return toUserResponse(await this.usersRepository.update(user, data));
  }

  async delete(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      throw new ForbiddenError('Você não pode excluir o próprio usuário');
    }
    const deleted = await this.usersRepository.deleteById(id);
    if (!deleted) throw new NotFoundError('Usuário não encontrado');
  }

  /** O usuário logado é ignorado caso esteja entre os IDs, evitando encerrar a própria sessão. */
  async deleteMany(ids: string[], currentUserId: string): Promise<DeleteResult> {
    const deletableIds = ids.filter((id) => id !== currentUserId);
    return { deleted: await this.usersRepository.deleteByIds(deletableIds) };
  }

  /** O usuário logado é preservado para não encerrar a própria sessão. */
  async deleteAll(currentUserId: string): Promise<DeleteResult> {
    return { deleted: await this.usersRepository.deleteAll([currentUserId]) };
  }

  private async getUserOrFail(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundError('Usuário não encontrado');
    return user;
  }

  /** Busca as regiões uma única vez e falha se algum código não existir. */
  private async loadRegions(codes: string[]): Promise<Map<string, Region>> {
    const uniqueCodes = [...new Set(codes)];
    const regions = await this.regionsRepository.findByCodes(uniqueCodes);
    const regionsByCode = new Map(regions.map((region) => [region.code, region]));

    const invalidCodes = uniqueCodes.filter((code) => !regionsByCode.has(code));
    if (invalidCodes.length > 0) {
      throw new AppError('Região(ões) inválida(s)', 400, { regionCodes: invalidCodes });
    }

    return regionsByCode;
  }

  private pickRegions(codes: string[], regionsByCode: Map<string, Region>): Region[] {
    return codes.flatMap((code) => {
      const region = regionsByCode.get(code);
      return region ? [region] : [];
    });
  }

  private async toCreateData(
    input: CreateUserInput,
    regionsByCode: Map<string, Region>,
  ): Promise<CreateUserData> {
    return {
      name: input.name,
      email: input.email,
      status: input.status,
      passwordHash: await this.hashProvider.hash(input.password),
      regions: this.pickRegions(input.regionCodes, regionsByCode),
    };
  }
}
