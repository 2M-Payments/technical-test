import type { Region } from '../types/user';
import { api } from './api';

export const regionsService = {
  async list(): Promise<Region[]> {
    const { data } = await api.get<Region[]>('/regions');
    return data;
  },
};
