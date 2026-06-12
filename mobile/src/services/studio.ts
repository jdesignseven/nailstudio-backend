import api from './api';
import { Studio } from '../types';

export async function getStudio(): Promise<Studio> {
  const { data } = await api.get('/studio');
  return data;
}

export async function updateStudio(data: Partial<Studio>): Promise<Studio> {
  const { data: res } = await api.put('/studio', data);
  return res;
}

export async function addProfessional(data: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  await api.post('/studio/professionals', data);
}

export async function getDashboard(): Promise<{
  totalAppointments: number;
  monthAppointments: number;
  totalClients: number;
  totalRevenue: number;
}> {
  const { data } = await api.get('/studio/dashboard');
  return data;
}
