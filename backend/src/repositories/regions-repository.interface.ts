import type { Region } from '../entities/region.entity';

export interface IRegionsRepository {
  findAll(): Promise<Region[]>;
  findByCodes(codes: string[]): Promise<Region[]>;
}
