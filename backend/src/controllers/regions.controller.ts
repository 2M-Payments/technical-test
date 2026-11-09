import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { RegionsService } from '../services/regions.service';

@injectable()
export class RegionsController {
  constructor(@inject(RegionsService) private readonly regionsService: RegionsService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.regionsService.list());
  };
}
