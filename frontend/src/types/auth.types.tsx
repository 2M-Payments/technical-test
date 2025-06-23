export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  signUp: (data: { name: string; email: string; password: string }) => Promise<void>;
}

