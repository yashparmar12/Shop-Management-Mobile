import { api } from './api';
import type { ApiResponse, User } from '../types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<User>>('/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; shopName?: string }) =>
    api.post<ApiResponse<User>>('/auth/register', data),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<User>>('/auth/reset-password', { token, password }),

  getMe: () => api.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/auth/profile', data),
};
