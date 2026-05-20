import { api } from './api';
import type { ApiResponse, Sale } from '../types';

export const saleService = {
  getAll: (params?: { startDate?: string; endDate?: string; limit?: number }) =>
    api.get<ApiResponse<Sale[]>>('/sales', { params }),

  getById: (id: string) => api.get<ApiResponse<Sale>>(`/sales/${id}`),

  create: (data: {
    items: { productId: string; quantity: number }[];
    discount?: number;
    taxRate?: number;
    customerId?: string;
    customerName?: string;
    paymentMethod?: string;
    amountPaid?: number;
    notes?: string;
  }) => api.post<ApiResponse<Sale>>('/sales', data),
};
