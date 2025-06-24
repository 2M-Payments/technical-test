import { inject, injectable } from 'tsyringe';
import { In, Repository } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction';

interface CreateData {
  title: string;
  amount: number;
  type: TransactionType;
}
type UpdateData = Partial<CreateData>;

@injectable()
export class TransactionService {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: Repository<Transaction>
  ) {}

  async create(data: CreateData, userId: string) {
    const transaction = this.transactionRepository.create({ ...data, userId });
    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async createMany(data: CreateData[], userId: string) {
    const transactions = data.map(item => this.transactionRepository.create({ ...item, userId }));
    await this.transactionRepository.save(transactions);
    return transactions;
  }

  private async findOneOrFail(id: string, userId: string) {
    const transaction = await this.transactionRepository.findOne({ where: { id, userId } });
    if (!transaction) {
      throw new Error('Transação não encontrada ou não pertence ao usuário');
    }
    return transaction;
  }
  
  async findById(id: string, userId: string) {
    return this.findOneOrFail(id, userId);
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 10) {
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
    return {
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  async getSummary(userId: string) {
    const transactions = await this.transactionRepository.find({ where: { userId } });
    const income = transactions
      .filter(t => t.type === TransactionType.ENTRADA)
      .reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.SAIDA)
      .reduce((acc, t) => acc + Number(t.amount), 0);
    return { income, expense, total: income - expense };
  }

  async update(id: string, data: UpdateData, userId: string) {
    const transaction = await this.findOneOrFail(id, userId);
    this.transactionRepository.merge(transaction, data);
    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async delete(id: string, userId: string) {
    await this.findOneOrFail(id, userId);
    await this.transactionRepository.delete(id);
  }

  async deleteMany(ids: string[], userId: string) {
    const transactions = await this.transactionRepository.find({
      where: { id: In(ids), userId: userId },
    });
    
    if(transactions.length !== ids.length) {
        throw new Error("Uma ou mais transações não foram encontradas ou não pertencem ao usuário.");
    }

    await this.transactionRepository.remove(transactions);
    return { deletedCount: transactions.length };
  }
  
  async deleteAll(userId: string) {
      const deleteResult = await this.transactionRepository.delete({ userId });
      return { deletedCount: deleteResult.affected || 0 };
  }
}
