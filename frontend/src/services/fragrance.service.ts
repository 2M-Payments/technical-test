import api from './api';

export interface Fragrance {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FragranceListResponse {
  data: Fragrance[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateFragranceData {
  name: string;
  description?: string;
  active?: boolean;
}

export const fragranceService = {
  getAll: async (): Promise<FragranceListResponse> => {
    return api.get<FragranceListResponse>('/fragrances');
  },

  getActive: async (): Promise<Fragrance[]> => {
    return api.get<Fragrance[]>('/fragrances/active');
  },

  getById: async (id: string): Promise<Fragrance> => {
    return api.get<Fragrance>(`/fragrances/${id}`);
  },

  create: async (data: CreateFragranceData, token: string): Promise<Fragrance> => {
    return api.post<Fragrance>('/fragrances', data, token);
  },

  createMany: async (data: CreateFragranceData[], token: string): Promise<Fragrance[]> => {
    return api.post<Fragrance[]>('/fragrances/batch', data, token);
  },

  update: async (id: string, data: Partial<CreateFragranceData>, token: string): Promise<Fragrance> => {
    return api.put<Fragrance>(`/fragrances/${id}`, data, token);
  },

  toggleActive: async (id: string, token: string): Promise<Fragrance> => {
    return api.patch<Fragrance>(`/fragrances/${id}/toggle`, undefined, token);
  },

  delete: async (id: string, token: string): Promise<void> => {
    return api.delete<void>(`/fragrances/${id}`, token);
  },

  deleteMany: async (ids: string[], token: string): Promise<void> => {
    return api.post<void>('/fragrances/delete-many', { ids }, token);
  },
};

export default fragranceService;
