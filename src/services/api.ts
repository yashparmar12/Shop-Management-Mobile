import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, TOKEN_KEY } from '../constants/config';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const getImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  const base = API_URL.replace('/api', '');
  return `${base}${path}`;
};
