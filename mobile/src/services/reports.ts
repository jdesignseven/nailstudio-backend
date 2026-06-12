import api from './api';

export interface MonthlyReportItem {
  year: number;
  month: number;
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
  completed: number;
  scheduled: number;
}

export async function getMonthlyReports(months = 12): Promise<MonthlyReportItem[]> {
  const response = await api.get(`/studio/reports/monthly?months=${months}`);
  return response.data;
}
