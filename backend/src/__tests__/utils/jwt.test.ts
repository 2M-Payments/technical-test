import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { signToken, verifyToken } from '../../utils/jwt';

describe('utils/jwt', () => {
  const payload = { sub: 'user-id-123' };

  it('deve gerar um token JWT válido com signToken', () => {
    const token = signToken(payload);
    expect(typeof token).toBe('string');

    const decoded = jwt.decode(token) as jwt.JwtPayload;
    expect(decoded.sub).toBe(payload.sub);
  });

  it('deve verificar corretamente um token válido com verifyToken', () => {
    const token = signToken(payload);
    const result = verifyToken(token) as jwt.JwtPayload;

    expect(result).toHaveProperty('sub', payload.sub);
    expect(result).toHaveProperty('iat');
    expect(result).toHaveProperty('exp');
  });

  it('deve lançar JsonWebTokenError ao verificar token inválido', () => {
    const invalidToken = 'token.invalido.aqui';

    try {
      verifyToken(invalidToken);
      fail('Era esperado que o token inválido lançasse erro');
    } catch (error) {
      expect(error).toBeInstanceOf(JsonWebTokenError);
      expect((error as JsonWebTokenError).message).toBe('invalid token');
    }
  });
});
