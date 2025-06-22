import { createContext} from 'react';

export interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  signUp: (data: { name: string; email: string; password: string }) => Promise<void>;
}


export const AuthContext = createContext<AuthContextData>({} as AuthContextData);


