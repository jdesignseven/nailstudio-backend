import api from './api';
import { DashboardData } from '../types';

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/studio/dashboard');
  return data;
}
