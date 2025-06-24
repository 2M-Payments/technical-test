import bcrypt from 'bcryptjs';
import { hashPassword, comparePasswords } from '../../utils/hash';

jest.mock('bcryptjs');

describe('Password Utils', () => {

  describe('hashPassword', () => {
    it('deve chamar crypt.hash com a senha correta', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const password = 'mySecretPassword';
      await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('deve retornar a senha criptografada de bcrypt', async () => {
      const mockHash = 'mocked_hashed_password_123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const hashedPassword = await hashPassword('any_password');

      expect(hashedPassword).toBe(mockHash);
    });
  });

  describe('comparePasswords', () => {
    it('deve chamar bcrypt.compare com os argumentos corretos', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const password = 'mySecretPassword';
      const hash = 'hashed_version_of_the_password';

      await comparePasswords(password, hash);

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('deve retornar true quando senhas são iguais', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePasswords('password', 'hash');

      expect(result).toBe(true);
    });

    it('deve retornar false quando senhas não são iguais', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePasswords('wrong_password', 'hash');

      expect(result).toBe(false);
    });
  });
});