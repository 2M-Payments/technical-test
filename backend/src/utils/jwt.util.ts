import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

interface TokenPayload {
  userId: string;
  email: string;
}

export class JwtUtil {
  static generateToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: '30m'
    };
    return jwt.sign(payload, jwtConfig.secret as Secret, options);
  }
  static refreshToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: '30m'
    };
    return jwt.sign(payload, jwtConfig.secret as Secret, options);
  }
  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      }
      throw new Error('Erro ao verificar token');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}