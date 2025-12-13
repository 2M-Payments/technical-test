import { Request, Response } from 'express';
import { PricingConfigService } from '../services/pricingConfig.service';

export class PricingConfigController {
  constructor(private pricingConfigService: PricingConfigService) { }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const config = await this.pricingConfigService.createPricingConfig(req.body);
      res.status(201).json(config);
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

      const result = await this.pricingConfigService.getAllPricingConfigs(page, limit, activeOnly);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const configs = await this.pricingConfigService.getActivePricingConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getPricingTable = async (req: Request, res: Response): Promise<void> => {
    try {
      const table = await this.pricingConfigService.getPricingTable();
      res.json(table);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const config = await this.pricingConfigService.getPricingConfigById(req.params.id);
      res.json(config);
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const config = await this.pricingConfigService.updatePricingConfig(req.params.id, req.body);
      res.json(config);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  toggleActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const config = await this.pricingConfigService.toggleActive(req.params.id);
      res.json(config);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.pricingConfigService.deletePricingConfig(req.params.id);
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

      const deleted = await this.pricingConfigService.deleteMany(ids);
      res.json({
        message: `${deleted} configuração(ões) deletada(s) com sucesso`,
        deleted
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  calculatePrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quantity } = req.query;

      if (!quantity || isNaN(Number(quantity))) {
        res.status(400).json({ error: 'Quantidade inválida' });
        return;
      }

      const pricing = await this.pricingConfigService.calculatePrice(Number(quantity));
      res.json(pricing);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}