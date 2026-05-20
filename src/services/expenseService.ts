import { api } from './api';
import type { ApiResponse, Expense } from '../types';

export const expenseService = {
  getAll: (params?: { month?: number; year?: number; category?: string }) =>
    api.get<{ success: boolean; data: Expense[]; total: number }>('/expenses', { params }),

  getById: (id: string) => api.get<ApiResponse<Expense>>(`/expenses/${id}`),

  create: (data: Partial<Expense>) => api.post<ApiResponse<Expense>>('/expenses', data),

  update: (id: string, data: Partial<Expense>) =>
    api.put<ApiResponse<Expense>>(`/expenses/${id}`, data),

  remove: (id: string) => api.delete(`/expenses/${id}`),
};
