import { AppDataSource } from '../ormconfig';
import { User } from '../entities/user';

export const userRepository = AppDataSource.getRepository(User);
