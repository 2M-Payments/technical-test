import api from './api';

export interface PricingConfig {
  id: string;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfigListResponse {
  data: PricingConfig[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePricingConfigData {
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  active?: boolean;
}

export interface PricingTableItem {
  range: string;
  unitPrice: number;
}

export const pricingService = {
  getAll: async (): Promise<PricingConfigListResponse> => {
    return api.get<PricingConfigListResponse>('/pricing-configs');
  },

  getActive: async (): Promise<PricingConfig[]> => {
    return api.get<PricingConfig[]>('/pricing-configs/active');
  },

  getPricingTable: async (): Promise<PricingTableItem[]> => {
    return api.get<PricingTableItem[]>('/pricing-configs');
  },

  calculatePrice: async (quantity: number): Promise<{ price: number; unitPrice: number }> => {
    return api.get<{ price: number; unitPrice: number }>(`/pricing-configs/calculate?quantity=${quantity}`);
  },

  getById: async (id: string): Promise<PricingConfig> => {
    return api.get<PricingConfig>(`/pricing-configs/${id}`);
  },

  create: async (data: CreatePricingConfigData, token: string): Promise<PricingConfig> => {
    return api.post<PricingConfig>('/pricing-configs', data, token);
  },

  update: async (id: string, data: Partial<CreatePricingConfigData>, token: string): Promise<PricingConfig> => {
    return api.put<PricingConfig>(`/pricing-configs/${id}`, data, token);
  },

  toggleActive: async (id: string, token: string): Promise<PricingConfig> => {
    return api.patch<PricingConfig>(`/pricing-configs/${id}/toggle`, undefined, token);
  },

  delete: async (id: string, token: string): Promise<void> => {
    return api.delete<void>(`/pricing-configs/${id}`, token);
  },

  deleteMany: async (ids: string[], token: string): Promise<void> => {
    return api.post<void>('/pricing-configs/delete-many', { ids }, token);
  },
};

export default pricingService;
