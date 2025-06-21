import 'reflect-metadata';
import { container } from 'tsyringe';
import { Repository, In } from 'typeorm';
import { Transaction, TransactionType } from '../entities/Transaction';
import { TransactionService } from '../services/TransactionService';

const mockTransactionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
};

container.register('TransactionRepository', {
  useValue: mockTransactionRepository,
});

describe('TransactionService', () => {
  let service: TransactionService;
  const userId = 'user-uuid-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = container.resolve(TransactionService);
  });

  describe('create', () => {
    it('deve criar uma nova transação com sucesso', async () => {
      const input = { title: 'Salário', amount: 5000, type: TransactionType.ENTRADA };
      const expectedTransaction = { ...input, userId, id: 'transaction-uuid' };

      mockTransactionRepository.create.mockReturnValue(expectedTransaction);
      mockTransactionRepository.save.mockResolvedValue(expectedTransaction);

      const result = await service.create(input, userId);

      expect(result).toEqual(expectedTransaction);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith({ ...input, userId });
      expect(mockTransactionRepository.save).toHaveBeenCalledWith(expectedTransaction);
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar uma lista paginada de transações', async () => {
        const transactions = [{ id: '1', title: 'Teste' }];
        const total = 1;
        mockTransactionRepository.findAndCount.mockResolvedValue([transactions, total]);
        
        const result = await service.findAllByUser(userId, 1, 10);

        expect(result.data).toEqual(transactions);
        expect(result.total).toBe(total);
        expect(mockTransactionRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
            where: { userId },
            skip: 0,
            take: 10
        }));
    });
  });
  
  describe('findById', () => {
      it('deve retornar uma transação se ela pertencer ao usuário', async () => {
          const transaction = { id: 't1', userId };
          mockTransactionRepository.findOne.mockResolvedValue(transaction);

          const result = await service.findById('t1', userId);

          expect(result).toEqual(transaction);
          expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({ where: { id: 't1', userId } });
      });

      it('deve lançar um erro se a transação não for encontrada', async () => {
          mockTransactionRepository.findOne.mockResolvedValue(null);
          await expect(service.findById('t1', userId)).rejects.toThrow('Transação não encontrada ou não pertence ao usuário');
      });
  });

  describe('delete', () => {
      it('deve deletar uma transação com sucesso', async () => {
        mockTransactionRepository.findOne.mockResolvedValue({ id: 't1', userId });

        await service.delete('t1', userId);
        
        expect(mockTransactionRepository.delete).toHaveBeenCalledWith('t1');
      });

      it('deve lançar um erro ao tentar deletar uma transação que não existe', async () => {
        mockTransactionRepository.findOne.mockResolvedValue(null);
        await expect(service.delete('t1', userId)).rejects.toThrow();
        expect(mockTransactionRepository.delete).not.toHaveBeenCalled();
      });
  });

  describe('deleteMany', () => {
      it('deve deletar múltiplas transações', async () => {
          const idsToDelete = ['t1', 't2'];
          const foundTransactions = [{ id: 't1', userId }, { id: 't2', userId }];
          mockTransactionRepository.find.mockResolvedValue(foundTransactions);

          const result = await service.deleteMany(idsToDelete, userId);

          expect(mockTransactionRepository.find).toHaveBeenCalledWith({ where: { id: In(idsToDelete), userId } });
          expect(mockTransactionRepository.remove).toHaveBeenCalledWith(foundTransactions);
          expect(result.deletedCount).toBe(2);
      });

      it('deve lançar um erro se uma das transações não pertencer ao usuário', async () => {
          const idsToDelete = ['t1', 't2'];
          const foundTransactions = [{ id: 't1', userId }];
          mockTransactionRepository.find.mockResolvedValue(foundTransactions);
          
          await expect(service.deleteMany(idsToDelete, userId)).rejects.toThrow("Uma ou mais transações não foram encontradas ou não pertencem ao usuário.");
      });
  });

  describe('getSummary', () => {
    it('deve calcular o resumo corretamente', async () => {
        const transactions = [
            { amount: 1000, type: TransactionType.ENTRADA },
            { amount: 200, type: TransactionType.SAIDA },
            { amount: 50, type: TransactionType.SAIDA },
        ];
        mockTransactionRepository.find.mockResolvedValue(transactions);

        const summary = await service.getSummary(userId);

        expect(summary.income).toBe(1000);
        expect(summary.expense).toBe(250);
        expect(summary.total).toBe(750);
    });
  });

});
