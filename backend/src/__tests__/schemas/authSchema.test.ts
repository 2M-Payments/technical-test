import { z } from 'zod';
import { registerSchema, loginSchema } from '../../schemas/authSchema';

describe('Auth Schemas', () => {
  describe('registerSchema', () => {
    it('deve validar um payload de registro correto', () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('deve falhar se o nome estiver faltando', () => {
      const invalidData = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('deve falhar se o email for inválido', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'password123',
      };
      
      expect(() => registerSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('deve falhar se a senha é muito curta', () => {
        const invalidData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123', 
        };

        try {
            registerSchema.parse(invalidData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                expect(error.issues[0].path[0]).toBe('password');
                expect(error.issues[0].message).toBe('Senha deve ter pelo menos 6 caracteres');
            }
        }
    });
  });

  describe('loginSchema', () => {
    it('deve validar um paylod de login correto', () => {
        const validData = {
            email: 'jane.doe@example.com',
            password: 'securepassword',
        };
        expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('deve falhar se o email estiver faltando', () => {
        const invalidData = {
            password: 'securepassword',
        };
        expect(() => loginSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('deve falhar se a senha é muito curta', () => {
        const invalidData = {
            email: 'jane.doe@example.com',
            password: 'short',
        };
        expect(() => loginSchema.parse(invalidData)).toThrow(z.ZodError);
    });
  });
});