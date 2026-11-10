import { Region } from '../../entities/region.entity';
import type { IRegionsRepository } from '../../repositories/regions-repository.interface';

export const makeRegion = (id: number, code: string, name: string): Region =>
  Object.assign(new Region(), { id, code, name, createdAt: new Date('2026-01-01T00:00:00Z') });

export class InMemoryRegionsRepository implements IRegionsRepository {
  regions: Region[] = [
    makeRegion(1, 'BR', 'Brasil'),
    makeRegion(2, 'GB', 'Reino Unido'),
    makeRegion(3, 'US', 'Estados Unidos'),
  ];

  async findAll(): Promise<Region[]> {
    return [...this.regions].sort((a, b) => a.name.localeCompare(b.name));
  }

  async findByCodes(codes: string[]): Promise<Region[]> {
    return this.regions.filter((region) => codes.includes(region.code));
  }
}
