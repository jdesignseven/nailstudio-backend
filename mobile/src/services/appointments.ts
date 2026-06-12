import api from './api';
import { Appointment } from '../types';

export async function getAppointments(params?: {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  professional?: string;
  status?: string;
}): Promise<Appointment[]> {
  const { data } = await api.get('/appointments', { params });
  return data;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
}

export async function createAppointment(appointment: {
  clientId: string;
  serviceId: string;
  userId: string;
  date: string;
  notes?: string;
  depositAmount?: number;
}): Promise<Appointment> {
  const { data } = await api.post('/appointments', appointment);
  return data;
}

export async function updateAppointment(
  id: string,
  appointment: Partial<Appointment>
): Promise<void> {
  await api.put(`/appointments/${id}`, appointment);
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/${id}`);
}
