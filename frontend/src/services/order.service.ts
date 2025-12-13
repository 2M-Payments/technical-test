import api from './api';

export interface OrderItem {
  id: string;
  fragranceId: string;
  fragrance?: {
    id: string;
    name: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: {
    fragranceId: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export interface CalculatePriceData {
  items: {
    fragranceId: string;
    quantity: number;
  }[];
}

export interface CalculatePriceResponse {
  items: {
    fragranceId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
}

export const orderService = {
  getAll: async (token: string): Promise<Order[]> => {
    return api.get<Order[]>('/orders', token);
  },

  getById: async (id: string, token: string): Promise<Order> => {
    return api.get<Order>(`/orders/${id}`, token);
  },

  getStats: async (token: string): Promise<OrderStats> => {
    return api.get<OrderStats>('/orders/stats', token);
  },

  calculatePrice: async (data: CalculatePriceData, token: string): Promise<CalculatePriceResponse> => {
    return api.post<CalculatePriceResponse>('/orders/calculate', data, token);
  },

  create: async (data: CreateOrderData, token: string): Promise<Order> => {
    return api.post<Order>('/orders', data, token);
  },

  createMany: async (data: CreateOrderData[], token: string): Promise<Order[]> => {
    return api.post<Order[]>('/orders/batch', data, token);
  },

  update: async (id: string, data: Partial<CreateOrderData & { status: Order['status'] }>, token: string): Promise<Order> => {
    return api.put<Order>(`/orders/${id}`, data, token);
  },

  delete: async (id: string, token: string): Promise<void> => {
    return api.delete<void>(`/orders/${id}`, token);
  },

  deleteMany: async (ids: string[], token: string): Promise<void> => {
    return api.delete<void>('/orders/batch/many', token);
  },
};

export default orderService;
