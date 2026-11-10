import bcrypt from 'bcryptjs';
import { injectable } from 'tsyringe';

import type { IHashProvider } from './hash-provider.interface';

const SALT_ROUNDS = 10;

@injectable()
export class BcryptHashProvider implements IHashProvider {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
