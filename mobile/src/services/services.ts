import api from './api';
import { Service } from '../types';

export async function getServices(filters?: { status?: string; category?: string }): Promise<Service[]> {
  const params: any = {};
  if (filters?.status && filters.status !== 'all') params.status = filters.status;
  if (filters?.category && filters.category !== 'all') params.category = filters.category;
  const { data } = await api.get('/services', { params });
  return data;
}

export async function createService(service: Partial<Service>): Promise<Service> {
  const { data } = await api.post('/services', service);
  return data;
}

export async function updateService(id: string, service: Partial<Service>): Promise<void> {
  await api.put(`/services/${id}`, service);
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}
