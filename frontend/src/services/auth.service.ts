import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
  };

}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  me: async (token: string): Promise<User> => {
    return api.get<User>('/auth/me', token);
  },

  verifyToken: async (token: string): Promise<{ valid: boolean; user?: User }> => {
    return api.post<{ valid: boolean; user?: User }>('/auth/verify-token', { token });
  },
};

export default authService;
