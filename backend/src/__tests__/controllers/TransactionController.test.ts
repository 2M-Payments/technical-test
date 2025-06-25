import 'reflect-metadata';
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { TransactionController } from '../../controllers/TransactionController';

const mockTransactionService = {
  create: jest.fn(),
  createMany: jest.fn(),
  findAllByUser: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  deleteAll: jest.fn(),
  getSummary: jest.fn(),
};

const makeMockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('TransactionController', () => {
  let controller: TransactionController;
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, 'resolve').mockReturnValue(mockTransactionService as any);
    controller = new TransactionController();
  });

  describe('create', () => {
    it('deve chamar o serviço e retornar 201 com a transação', async () => {
      const mockReq = {
        body: { title: 'Salário', amount: 5000, type: 'ganho' },
        user: { id: userId },
      } as unknown as Request;
      const mockRes = makeMockRes();
      const expectedTransaction = { id: 't1', ...mockReq.body };
      
      mockTransactionService.create.mockResolvedValue(expectedTransaction);

      await controller.create(mockReq, mockRes);

      expect(mockTransactionService.create).toHaveBeenCalledWith(mockReq.body, userId);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expectedTransaction);
    });
  });

  describe('findAll', () => {
    it('deve chamar o serviço com paginação e retornar 200', async () => {
      const mockReq = {
        query: { page: '1', limit: '10' },
        user: { id: userId },
      } as unknown as Request;
      const mockRes = makeMockRes();
      const expectedResult = { data: [], total: 0 };

      mockTransactionService.findAllByUser.mockResolvedValue(expectedResult);
      
      await controller.findAll(mockReq, mockRes);

      expect(mockTransactionService.findAllByUser).toHaveBeenCalledWith(userId, 1, 10);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('findOne', () => {
    it('deve chamar o serviço com o ID e retornar 200', async () => {
        const transactionId = 't1';
        const mockReq = { params: { id: transactionId }, user: { id: userId } } as unknown as Request;
        const mockRes = makeMockRes();
        const expectedTransaction = { id: transactionId, title: 'Teste' };
        mockTransactionService.findById.mockResolvedValue(expectedTransaction);

        await controller.findOne(mockReq, mockRes);

        expect(mockTransactionService.findById).toHaveBeenCalledWith(transactionId, userId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expectedTransaction);
    });
  });

  describe('update', () => {
    it('deve chamar o serviço com o ID e os dados e retornar 200', async () => {
        const transactionId = 't1';
        const updateData = { title: 'Título atualizado' };
        const mockReq = { params: { id: transactionId }, body: updateData, user: { id: userId } } as unknown as Request;
        const mockRes = makeMockRes();
        mockTransactionService.update.mockResolvedValue({ id: transactionId, ...updateData });

        await controller.update(mockReq, mockRes);

        expect(mockTransactionService.update).toHaveBeenCalledWith(transactionId, updateData, userId);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve chamar o serviço e retornar 204', async () => {
      const mockReq = {
        params: { id: 't-to-delete' },
        user: { id: userId },
      } as unknown as Request;
      const mockRes = makeMockRes();
      
      mockTransactionService.delete.mockResolvedValue(undefined);

      await controller.delete(mockReq, mockRes);

      expect(mockTransactionService.delete).toHaveBeenCalledWith('t-to-delete', userId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe('deleteMany', () => {
      it('deve chamar o serviço com os IDs do body e retornar 200', async () => {
          const ids = ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'];
          const mockReq = { body: { ids }, user: { id: userId } } as unknown as Request;
          const mockRes = makeMockRes();
          const expectedResult = { deletedCount: 2 };

          mockTransactionService.deleteMany.mockResolvedValue(expectedResult);

          await controller.deleteMany(mockReq, mockRes);

          expect(mockTransactionService.deleteMany).toHaveBeenCalledWith(ids, userId);
          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
      });
  });

});
