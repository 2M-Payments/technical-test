import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { onSessionRenewed, onUnauthorized } from '../services/api';
import { authService } from '../services/auth.service';
import type { AuthUser, SessionResponse } from '../types/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  sessionExpiresAt: string | null;
  /** Verdadeiro quando o usuário foi deslogado por expiração (30 min de inatividade). */
  sessionExpired: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const startSession = useCallback((session: SessionResponse) => {
    setUser(session.user);
    setSessionExpiresAt(session.expiresAt);
    setSessionExpired(false);
    setStatus('authenticated');
  }, []);

  const endSession = useCallback((expired: boolean) => {
    setUser(null);
    setSessionExpiresAt(null);
    setSessionExpired(expired);
    setStatus('unauthenticated');
  }, []);

  // Recupera a sessão existente (cookie) ao abrir a aplicação.
  useEffect(() => {
    authService
      .me()
      .then(startSession)
      .catch(() => endSession(false));
  }, [startSession, endSession]);

  // Qualquer 401 da API encerra a sessão no cliente.
  const statusRef = useRef(status);
  statusRef.current = status;
  useEffect(
    () =>
      onUnauthorized(() => {
        if (statusRef.current === 'authenticated') endSession(true);
      }),
    [endSession],
  );

  useEffect(() => onSessionRenewed(setSessionExpiresAt), []);

  // Desloga automaticamente quando o prazo de inatividade termina, mesmo sem novas requisições.
  useEffect(() => {
    if (!sessionExpiresAt) return;
    const remaining = new Date(sessionExpiresAt).getTime() - Date.now();
    const timeout = window.setTimeout(() => endSession(true), Math.max(remaining, 0));
    return () => window.clearTimeout(timeout);
  }, [sessionExpiresAt, endSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      startSession(await authService.login(email, password));
    },
    [startSession],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      endSession(false);
    }
  }, [endSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, sessionExpiresAt, sessionExpired, login, logout }),
    [user, status, sessionExpiresAt, sessionExpired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
