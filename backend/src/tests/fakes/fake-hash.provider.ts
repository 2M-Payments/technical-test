import type { IHashProvider } from '../../providers/hash/hash-provider.interface';

/** Hash determinístico e instantâneo para testes (sem custo do bcrypt). */
export class FakeHashProvider implements IHashProvider {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return hashed === `hashed:${plain}`;
  }
}
