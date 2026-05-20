import { api } from './api';
import type { ApiResponse, Product } from '../types';

export const productService = {
  getAll: (params?: { search?: string; category?: string; lowStock?: boolean }) =>
    api.get<ApiResponse<Product[]>>('/products', { params }),

  getById: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),

  getCategories: () => api.get<ApiResponse<string[]>>('/products/categories'),

  getLowStock: () => api.get<ApiResponse<Product[]>>('/products/low-stock'),

  create: (formData: FormData) =>
    api.post<ApiResponse<Product>>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, formData: FormData) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  remove: (id: string) => api.delete(`/products/${id}`),
};
