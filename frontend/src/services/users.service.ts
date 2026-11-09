import axios from 'axios';

import type {
  ListUsersParams,
  PaginatedResponse,
  UpdateUserPayload,
  User,
  UserPayload,
} from '../types/user';
import { api } from './api';

/** Remove filtros vazios para não enviar `?status=&search=` à API. */
const compactParams = (params: ListUsersParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  );

export const usersService = {
  async list(params: ListUsersParams): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>('/users', {
      params: compactParams(params),
    });
    return data;
  },

  /**
   * Usado pela listagem: com o filtro `id`, busca só aquele usuário (GET /users/:id)
   * e um 404 vira lista vazia; sem ele, usa a listagem paginada com filtros.
   */
  async search(params: ListUsersParams): Promise<PaginatedResponse<User>> {
    if (!params.id) return usersService.list(params);

    const emptyMeta = { page: 1, limit: params.limit, total: 0, totalPages: 0 };
    try {
      const user = await usersService.getById(params.id);
      return { data: [user], meta: { ...emptyMeta, total: 1, totalPages: 1 } };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { data: [], meta: emptyMeta };
      }
      throw error;
    }
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async create(payload: UserPayload): Promise<User> {
    const { data } = await api.post<User>('/users', payload);
    return data;
  },

  async createMany(users: UserPayload[]): Promise<{ created: number; data: User[] }> {
    const { data } = await api.post<{ created: number; data: User[] }>('/users/bulk', { users });
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async removeMany(ids: string[]): Promise<{ deleted: number }> {
    const { data } = await api.delete<{ deleted: number }>('/users/bulk', { data: { ids } });
    return data;
  },

  async removeAll(): Promise<{ deleted: number }> {
    const { data } = await api.delete<{ deleted: number }>('/users', {
      params: { confirm: 'true' },
    });
    return data;
  },
};
