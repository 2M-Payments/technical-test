import type { Request, Response } from 'express';

import { RegionsController } from '../../../controllers/regions.controller';
import { RegionsService } from '../../../services/regions.service';
import { InMemoryRegionsRepository } from '../../fakes/in-memory-regions.repository';

describe('RegionsController', () => {
  it('responde com a lista de regiões do service', async () => {
    const controller = new RegionsController(new RegionsService(new InMemoryRegionsRepository()));
    const res = { json: jest.fn() } as unknown as Response;

    await controller.list({} as Request, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        { code: 'BR', name: 'Brasil' },
        { code: 'GB', name: 'Reino Unido' },
      ]),
    );
  });
});
