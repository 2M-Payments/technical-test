import type { SessionResponse } from '../types/auth';
import { api } from './api';

export const authService = {
  async login(email: string, password: string): Promise<SessionResponse> {
    const { data } = await api.post<SessionResponse>('/auth/login', { email, password });
    return data;
  },

  async me(): Promise<SessionResponse> {
    const { data } = await api.get<SessionResponse>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
