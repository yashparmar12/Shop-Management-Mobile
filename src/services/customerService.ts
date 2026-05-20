import { api } from './api';
import type { ApiResponse, Customer } from '../types';

export const customerService = {
  getAll: (search?: string) =>
    api.get<ApiResponse<Customer[]>>('/customers', { params: { search } }),

  getById: (id: string) => api.get<ApiResponse<Customer>>(`/customers/${id}`),

  create: (data: Partial<Customer>) => api.post<ApiResponse<Customer>>('/customers', data),

  update: (id: string, data: Partial<Customer>) =>
    api.put<ApiResponse<Customer>>(`/customers/${id}`, data),

  remove: (id: string) => api.delete(`/customers/${id}`),

  recordPayment: (id: string, data: { amount: number; method: string; note?: string }) =>
    api.post<ApiResponse<Customer>>(`/customers/${id}/payments`, data),
};
