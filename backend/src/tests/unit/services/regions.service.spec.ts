import { RegionsService } from '../../../services/regions.service';
import { InMemoryRegionsRepository } from '../../fakes/in-memory-regions.repository';

describe('RegionsService', () => {
  it('lista as regiões ordenadas por nome expondo apenas código e nome', async () => {
    const service = new RegionsService(new InMemoryRegionsRepository());

    await expect(service.list()).resolves.toEqual([
      { code: 'BR', name: 'Brasil' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'GB', name: 'Reino Unido' },
    ]);
  });
});
