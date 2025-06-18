
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

 const login = async (email: string, password: string) => {
  try {
    const userData = await apiLogin(email, password);
    storeUser(userData);
    setUser(userData);
  } catch (error) {
    throw error; 
  }
};
  const register =  async (email: string, password: string, userName: string) => {
     
    const register = await registerUser(email, password, userName);
    if (register) {
      const userData = await apiLogin(email, password);
      storeUser(userData);
      setUser(userData);
      login(email, password);
    } else {
      throw new Error('Registration failed');
    }
   
  };

  const logout = () => {
    clearUser();
    setUser(null);
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
  return context;
};