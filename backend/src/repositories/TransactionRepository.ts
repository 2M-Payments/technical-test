
import { AppDataSource } from '../ormconfig'; 
import { Transaction } from '../entities/Transaction';

export const transactionRepository = AppDataSource.getRepository(Transaction);