import { createContext, useContext, useState, ReactNode } from 'react';
import { login as apiLogin, getStoredUser, clearUser, storeUser, registerUser } from '../services/authService';

type AuthContextType = {
  user: { email: string; token: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, userName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getStoredUser());

  // ✅ Adicione logs para debug
  console.log('🔍 AuthProvider inicializado com usuário:', user);

  const login = async (email: string, password: string) => {
    try {
      console.log('🚀 Tentando fazer login...');
      const userData = await apiLogin(email, password);
      console.log('✅ Login bem-sucedido:', userData);
      
      storeUser(userData);
      setUser(userData);
      
      console.log('💾 Usuário armazenado e estado atualizado');
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error; 
    }
  };

  // ✅ Função register corrigida
  const register = async (email: string, password: string, userName: string) => {
    try {
      console.log('🚀 Tentando registrar usuário...');
      
      // Registra o usuário
      await registerUser(email, password, userName);
      console.log('✅ Usuário registrado com sucesso');
      
      // Faz login automático após registro
      await login(email, password);
      console.log('✅ Login automático após registro realizado');
      
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      throw new Error('Falha ao registrar usuário');
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    clearUser();
    setUser(null);
    console.log('✅ Logout realizado');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  
  // ✅ Log para debug
  console.log('🔍 useAuth chamado, usuário atual:', context.user);
  
  return context;
};
