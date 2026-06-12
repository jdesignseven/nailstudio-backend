import api, { setAuthToken, removeAuthToken } from './api';
import { AuthResponse } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', { email, password });
  await setAuthToken(data.token);
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  studioName?: string
): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', { name, email, password, studioName });
  await setAuthToken(data.token);
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logout() {
  await removeAuthToken();
}
