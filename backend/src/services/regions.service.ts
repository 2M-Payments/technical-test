import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../config/tokens';
import type { IRegionsRepository } from '../repositories/regions-repository.interface';

export interface RegionResponse {
  code: string;
  name: string;
}

@injectable()
export class RegionsService {
  constructor(
    @inject(TOKENS.RegionsRepository)
    private readonly regionsRepository: IRegionsRepository,
  ) {}

  async list(): Promise<RegionResponse[]> {
    const regions = await this.regionsRepository.findAll();
    return regions.map(({ code, name }) => ({ code, name }));
  }
}
