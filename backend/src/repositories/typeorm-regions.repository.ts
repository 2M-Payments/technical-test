import { DataSource, In, type Repository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../config/tokens';
import { Region } from '../entities/region.entity';
import type { IRegionsRepository } from './regions-repository.interface';

@injectable()
export class TypeOrmRegionsRepository implements IRegionsRepository {
  private readonly repository: Repository<Region>;

  constructor(@inject(TOKENS.DataSource) dataSource: DataSource) {
    this.repository = dataSource.getRepository(Region);
  }

  findAll(): Promise<Region[]> {
    return this.repository.find({ order: { name: 'ASC' } });
  }

  findByCodes(codes: string[]): Promise<Region[]> {
    if (codes.length === 0) return Promise.resolve([]);
    return this.repository.find({ where: { code: In(codes) } });
  }
}
