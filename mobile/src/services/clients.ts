import api from './api';
import { Client } from '../types';

export async function getClients(): Promise<Client[]> {
  const { data } = await api.get('/clients');
  return data;
}

export async function getClient(id: string): Promise<Client> {
  const { data } = await api.get(`/clients/${id}`);
  return data;
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  const { data } = await api.post('/clients', client);
  return data;
}

export async function updateClient(id: string, client: Partial<Client>): Promise<void> {
  await api.put(`/clients/${id}`, client);
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}

export async function saveAnamnesis(clientId: string, anamnesis: any): Promise<void> {
  await api.post(`/clients/${clientId}/anamnesis`, anamnesis);
}
