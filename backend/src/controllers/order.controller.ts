import { Request, Response } from 'express';
import { OrderStatus } from '../entities/Order.entity';
import { OrderService } from '../services/order.service';

export class OrderController {
  constructor(private orderService: OrderService) { }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId!;
      const order = await this.orderService.createOrder(userId, req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  createMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId!;

      if (!Array.isArray(req.body)) {
        res.status(400).json({ error: 'Body deve ser um array' });
        return;
      }

      const orders = await this.orderService.createMany(userId, req.body);
      res.status(201).json({
        message: `${orders.length} pedido(s) criado(s) com sucesso`,
        orders
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
      const status = req.query.status as OrderStatus | undefined;
      const userId = req.user?.userId;

      const result = await this.orderService.getAllOrders(page, limit, userId, status);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const order = await this.orderService.getOrderById(req.params.id, userId);
      res.json(order);
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const order = await this.orderService.updateOrder(req.params.id, req.body, userId);
      res.json(order);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      await this.orderService.deleteOrder(req.params.id, userId);
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
      const userId = req.user?.userId;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'IDs inválidos' });
        return;
      }

      const deleted = await this.orderService.deleteMany(ids, userId);
      res.json({
        message: `${deleted} pedido(s) deletado(s) com sucesso`,
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
      const pricing = await this.orderService.calculatePrice(req.body);
      res.json(pricing);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req?.user?.userId;
      const stats = await this.orderService.getOrderStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}
