import { container } from 'tsyringe';
import { userRepository } from '../repositories/UserRepository';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

container.register<Repository<User>>('UserRepository', {
  useValue: userRepository,
});
