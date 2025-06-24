import { useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { type AuthContextData} from '../types/authTypes'
import * as authService from '../services/authService';
import api from '../services/api'
import type { LoginData, RegisterData } from '../types/authTypes';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }:AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('@App:token');
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
    }
  }, []);

  const signIn = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      const apiToken = response.data.token;
      setToken(apiToken);
      localStorage.setItem('@App:token', apiToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
      navigate('/dashboard');
    } catch (error) {
      console.error('Falha na autenticação', error);
      alert('Email ou senha inválidos!');
    }
  };

  const signOut = () => {
    setToken(null);
    localStorage.removeItem('@App:token');
    api.defaults.headers.common['Authorization'] = null;
    navigate('/login');
  };

  const signUp = async (data: RegisterData) => {
    try {
      await authService.register(data);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err: any) {
      console.error('Erro no cadastro', err);
      alert(err.response?.data?.message || 'Erro no cadastro');
    }
  };

  const isAuthenticated = !!token;

  const providerValue: AuthContextData = {
    isAuthenticated,
    token,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
