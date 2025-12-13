import api from './api';

export interface PricingConfig {
  id: string;
  minQuantity: number;
  maxQuantity: number;
  pricePerUnit: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingConfigData {
  minQuantity: number;
  maxQuantity: number;
  pricePerUnit: number;
  active?: boolean;
}

export interface PricingTableItem {
  range: string;
  pricePerUnit: number;
}

export const pricingService = {
  getAll: async (): Promise<PricingConfig[]> => {
    return api.get<PricingConfig[]>('/pricing-config');
  },

  getActive: async (): Promise<PricingConfig[]> => {
    return api.get<PricingConfig[]>('/pricing-config/active');
  },

  getPricingTable: async (): Promise<PricingTableItem[]> => {
    return api.get<PricingTableItem[]>('/pricing-config');
  },

  calculatePrice: async (quantity: number): Promise<{ price: number; unitPrice: number }> => {
    return api.get<{ price: number; unitPrice: number }>(`/pricing-config/calculate?quantity=${quantity}`);
  },

  getById: async (id: string): Promise<PricingConfig> => {
    return api.get<PricingConfig>(`/pricing-config/${id}`);
  },

  create: async (data: CreatePricingConfigData, token: string): Promise<PricingConfig> => {
    return api.post<PricingConfig>('/pricing-config', data, token);
  },

  update: async (id: string, data: Partial<CreatePricingConfigData>, token: string): Promise<PricingConfig> => {
    return api.put<PricingConfig>(`/pricing-config/${id}`, data, token);
  },

  toggleActive: async (id: string, token: string): Promise<PricingConfig> => {
    return api.patch<PricingConfig>(`/pricing-config/${id}/toggle`, undefined, token);
  },

  delete: async (id: string, token: string): Promise<void> => {
    return api.delete<void>(`/pricing-config/${id}`, token);
  },

  deleteMany: async (ids: string[], token: string): Promise<void> => {
    return api.post<void>('/pricing-config/delete-many', { ids }, token);
  },
};

export default pricingService;
