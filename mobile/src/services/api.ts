import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import { getItem, setItem, removeItem } from './storage';

const API_URL = 'http://192.168.0.104:8083/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeItem('token');
      if (error.config?.url !== '/auth/login') {
        router.replace('/(auth)/login');
      }
    }
    return Promise.reject(error);
  }
);

export async function setAuthToken(token: string) {
  await setItem('token', token);
}

export async function getAuthToken() {
  return getItem('token');
}

export async function removeAuthToken() {
  await removeItem('token');
}

export default api;
