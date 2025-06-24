import type { AxiosResponse } from 'axios';
import api from './api';
import type { LoginData, RegisterData, LoginResponse } from '../types/authTypes';

export const login = (data: LoginData): Promise<AxiosResponse<LoginResponse>> => {
  return api.post<LoginResponse>('/auth/login', data);
};

export const register = (data: RegisterData): Promise<AxiosResponse<void>> => {
  return api.post<void>('/auth/register', data);
};
