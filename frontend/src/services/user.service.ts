import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  getAll: async (token: string): Promise<User[]> => {
    return api.get<User[]>('/users', token);
  },

  getById: async (id: string, token: string): Promise<User> => {
    return api.get<User>(`/users/${id}`, token);
  },

  create: async (data: CreateUserData, token: string): Promise<User> => {
    return api.post<User>('/users', data, token);
  },

  createMany: async (data: CreateUserData[], token: string): Promise<User[]> => {
    return api.post<User[]>('/users/batch', data, token);
  },

  update: async (id: string, data: Partial<CreateUserData>, token: string): Promise<User> => {
    return api.put<User>(`/users/${id}`, data, token);
  },

  delete: async (id: string, token: string): Promise<void> => {
    return api.delete<void>(`/users/${id}`, token);
  },

  deleteMany: async (ids: string[], token: string): Promise<void> => {
    return api.delete<void>('/users/batch/many', token);
  },
};

export default userService;
