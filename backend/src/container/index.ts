import { container } from 'tsyringe';
import { userRepository } from '../repositories/UserRepository';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { Transaction } from '../entities/Transaction';
import { transactionRepository } from '../repositories/TransactionRepository';

container.register<Repository<User>>('UserRepository', {
  useValue: userRepository,
});

container.register<Repository<Transaction>>('TransactionRepository', {
  useValue: transactionRepository,
});