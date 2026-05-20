import { api } from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  getDashboard: () => api.get<{ success: boolean; data: DashboardData }>('/dashboard'),

  getReports: (type: 'daily' | 'monthly' | 'custom', params?: Record<string, string>) =>
    api.get('/dashboard/reports', { params: { type, ...params } }),
};
