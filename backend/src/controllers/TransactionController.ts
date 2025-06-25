import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransactionService } from '../services/TransactionService';
import { createTransactionSchema, updateTransactionSchema, createManyTransactionsSchema, deleteManyTransactionsSchema } from '../schemas/transactionSchema';

export class TransactionController {
  private getService(): TransactionService {
    return container.resolve(TransactionService);
  }

  create = async (req: Request, res: Response) => {
    const data = createTransactionSchema.parse(req.body);
    const userId = req.user!.id;
    const transaction = await this.getService().create(data, userId);
    return res.status(201).json(transaction);
  };
  
  createMany = async (req: Request, res: Response) => {
    const data = createManyTransactionsSchema.parse(req.body);
    const userId = req.user!.id;
    const transactions = await this.getService().createMany(data, userId);
    return res.status(201).json(transactions);
  };
  
  findAll = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const result = await this.getService().findAllByUser(userId, page, limit);
    return res.status(200).json(result);
  };
  
  findOne = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const transaction = await this.getService().findById(id, userId);
    return res.status(200).json(transaction);
  }

  getSummary = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const summary = await this.getService().getSummary(userId);
    return res.status(200).json(summary);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateTransactionSchema.parse(req.body);
    const userId = req.user!.id;
    const transaction = await this.getService().update(id, data, userId);
    return res.status(200).json(transaction);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    await this.getService().delete(id, userId);
    return res.status(204).send();
  };
  
  deleteMany = async (req: Request, res: Response) => {
    const { ids } = deleteManyTransactionsSchema.parse(req.body);
    const userId = req.user!.id;
    const result = await this.getService().deleteMany(ids, userId);
    return res.status(200).json(result);
  };

  deleteAll = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await this.getService().deleteAll(userId);
    return res.status(200).json(result);
  };
}
