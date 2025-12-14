import { Request, Response } from 'express';
import { FragranceService, IFragranceService } from '../services/fragrance.service';

export interface IFragranceController {
  create(req: Request, res: Response): Promise<void>;
  createMany(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  getActive(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  toggleActive(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
  deleteMany(req: Request, res: Response): Promise<void>;
}

export class FragranceController implements IFragranceController {
  constructor(private readonly fragranceService: IFragranceService) { }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const fragrance = await this.fragranceService.createFragrance(req.body);
      res.status(201).json(fragrance);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  createMany = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!Array.isArray(req.body)) {
        res.status(400).json({ error: 'Body deve ser um array' });
        return;
      }

      const fragrances = await this.fragranceService.createMany(req.body);
      res.status(201).json({
        message: `${fragrances.length} fragrância(s) criada(s) com sucesso`,
        fragrances
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const activeOnly = req.query.activeOnly === 'true';

      const result = await this.fragranceService.getAllFragrances(page, limit, activeOnly);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const fragrances = await this.fragranceService.getActiveFragrances();
      res.json(fragrances);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const fragrance = await this.fragranceService.getFragranceById(req.params.id);
      res.json(fragrance);
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const fragrance = await this.fragranceService.updateFragrance(req.params.id, req.body);
      res.json(fragrance);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  toggleActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const fragrance = await this.fragranceService.toggleActive(req.params.id);
      res.json(fragrance);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.fragranceService.deleteFragrance(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  deleteMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'IDs inválidos' });
        return;
      }

      const deleted = await this.fragranceService.deleteMany(ids);
      res.json({
        message: `${deleted} fragrância(s) deletada(s) com sucesso`,
        deleted
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}