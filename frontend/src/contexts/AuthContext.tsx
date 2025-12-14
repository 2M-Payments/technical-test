import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const verifyToken = async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.verifyToken(storedToken);
      if (response.valid && response.user) {
        setToken(storedToken);
        setUser(response.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  verifyToken();
}, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    console.log(response.token, '<<');
    localStorage.setItem('token', response.token);
    console.log('Token saved to localStorage');
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
