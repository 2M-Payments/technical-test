import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    email: string;
  }
}

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'chave-ultra-secreta-do-papai',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 60 * 1000, // 30 minutos
    sameSite: 'strict'
  },
  rolling: true // Renova a cada request
});
