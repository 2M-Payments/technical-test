import api from '../../services/api';
import {
  getTransactions,
  getSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createBatchTransactions,
  deleteBatchTransactions,
  deleteAllTransactions,
} from '../../services/transactionService';
import { type TransactionInput } from '../../types/transactionTypes';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getTransactions: deve chamar api.get com a página e limite corretos', async () => {
    await getTransactions(2, 20);
    expect(mockedApi.get).toHaveBeenCalledWith('/transactions?page=2&limit=20');
  });

  it('getSummary: deve chamar api.get para o endpoint de sumário', async () => {
    await getSummary();
    expect(mockedApi.get).toHaveBeenCalledWith('/transactions/summary');
  });

  it('createTransaction: deve chamar api.post com os dados da transação', async () => {
    const newTransaction: TransactionInput = { title: 'Salário', amount: 5000, type: 'ganho' };
    await createTransaction(newTransaction);
    expect(mockedApi.post).toHaveBeenCalledWith('/transactions', newTransaction);
  });

  it('updateTransaction: deve chamar api.put com o id e os dados parciais', async () => {
    const transactionId = 'id-123';
    const updatedData: Partial<TransactionInput> = { amount: 5500 };
    await updateTransaction(transactionId, updatedData);
    expect(mockedApi.put).toHaveBeenCalledWith(`/transactions/${transactionId}`, updatedData);
  });

  it('deleteTransaction: deve chamar api.delete com o id correto', async () => {
    const transactionId = 'id-123';
    await deleteTransaction(transactionId);
    expect(mockedApi.delete).toHaveBeenCalledWith(`/transactions/${transactionId}`);
  });

  it('createBatchTransactions: deve chamar api.post com um array de transações', async () => {
    const transactions: TransactionInput[] = [{ title: 'Conta de Luz', amount: 200, type: 'despesa' }];
    await createBatchTransactions(transactions);
    expect(mockedApi.post).toHaveBeenCalledWith('/transactions/batch', transactions);
  });
  
  it('deleteBatchTransactions: deve chamar api.delete com o array de ids no corpo', async () => {
    const ids = ['id1', 'id2'];
    await deleteBatchTransactions(ids);
    expect(mockedApi.delete).toHaveBeenCalledWith('/transactions/batch', { data: { ids } });
  });

  it('deleteAllTransactions: deve chamar api.delete para o endpoint de apagar tudo', async () => {
    await deleteAllTransactions();
    expect(mockedApi.delete).toHaveBeenCalledWith('/transactions/all');
  });
});

