import { api } from './api';
import type { ApiResponse, Supplier, PurchaseRecord } from '../types';

export const supplierService = {
  getAll: () => api.get<ApiResponse<Supplier[]>>('/suppliers'),

  getById: (id: string) => api.get<ApiResponse<Supplier>>(`/suppliers/${id}`),

  create: (data: Partial<Supplier>) => api.post<ApiResponse<Supplier>>('/suppliers', data),

  update: (id: string, data: Partial<Supplier>) =>
    api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data),

  remove: (id: string) => api.delete(`/suppliers/${id}`),

  addPurchase: (id: string, data: Partial<PurchaseRecord>) =>
    api.post<ApiResponse<Supplier>>(`/suppliers/${id}/purchases`, data),
};
