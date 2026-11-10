import { container } from 'tsyringe';
import type { DataSource } from 'typeorm';

import { TOKENS } from './tokens';
import { TypeOrmRegionsRepository } from '../repositories/typeorm-regions.repository';
import type { IRegionsRepository } from '../repositories/regions-repository.interface';
import { TypeOrmUsersRepository } from '../repositories/typeorm-users.repository';
import type { IUsersRepository } from '../repositories/users-repository.interface';
import { BcryptHashProvider } from '../providers/hash/bcrypt-hash.provider';
import type { IHashProvider } from '../providers/hash/hash-provider.interface';

/**
 * Composition root: o único lugar que conhece as implementações concretas.
 * Services e controllers dependem apenas das interfaces via tokens.
 */
export function registerDependencies(dataSource: DataSource): void {
  container.registerInstance<DataSource>(TOKENS.DataSource, dataSource);

  container.registerSingleton<IUsersRepository>(TOKENS.UsersRepository, TypeOrmUsersRepository);
  container.registerSingleton<IRegionsRepository>(
    TOKENS.RegionsRepository,
    TypeOrmRegionsRepository,
  );
  container.registerSingleton<IHashProvider>(TOKENS.HashProvider, BcryptHashProvider);
}
