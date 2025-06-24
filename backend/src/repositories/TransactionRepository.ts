
import { AppDataSource } from '../ormconfig'; 
import { Transaction } from '../entities/transaction';

export const transactionRepository = AppDataSource.getRepository(Transaction);