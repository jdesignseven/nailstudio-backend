import { api } from '../api';
import type { DashboardData, Appointment, Client, Service, Expense } from '../types';

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/studio/dashboard');
  return data;
}

export async function getAppointments(params?: { month?: number; year?: number }): Promise<Appointment[]> {
  const { data } = await api.get('/appointments', { params });
  return data;
}

export async function createAppointment(data: { clientId: string; serviceId: string; userId: string; date: string; notes?: string; depositAmount?: number }): Promise<Appointment> {
  const { data: appointment } = await api.post('/appointments', data);
  return appointment;
}

export async function getClients(): Promise<Client[]> {
  const { data } = await api.get('/clients');
  return data;
}

export async function createClient(data: { name: string; phone?: string; email?: string; notes?: string }): Promise<Client> {
  const { data: client } = await api.post('/clients', data);
  return client;
}

export async function getServices(): Promise<Service[]> {
  const { data } = await api.get('/services');
  return data;
}

export async function createService(data: { name: string; description?: string; price: number; duration: number; category?: string; active?: boolean }): Promise<Service> {
  const { data: service } = await api.post('/services', data);
  return service;
}

export async function getExpenses(params?: { month?: number; year?: number }): Promise<Expense[]> {
  const { data } = await api.get('/expenses', { params });
  return data;
}

export async function createExpense(data: { description: string; amount: number; category?: string; date: string; notes?: string }): Promise<Expense> {
  const { data: expense } = await api.post('/expenses', data);
  return expense;
}

export async function getMonthlyReports(months = 12) {
  const { data } = await api.get('/studio/reports/monthly?months=' + months);
  return data;
}
