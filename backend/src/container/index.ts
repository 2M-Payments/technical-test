import { container } from 'tsyringe';
import { userRepository } from '../repositories/UserRepository';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { Transaction } from '../entities/transaction';
import { transactionRepository } from '../repositories/TransactionRepository';

container.register<Repository<User>>('UserRepository', {
  useValue: userRepository,
});

container.register<Repository<Transaction>>('TransactionRepository', {
  useValue: transactionRepository,
});