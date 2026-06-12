import api from './api';
import { Expense } from '../types';

interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}

export async function getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  const params: any = {};
  if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters?.dateTo) params.dateTo = filters.dateTo;
  if (filters?.category) params.category = filters.category;
  const { data } = await api.get('/expenses', { params });
  return data;
}

export async function createExpense(input: {
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}): Promise<Expense> {
  const { data } = await api.post('/expenses', input);
  return data;
}

export async function updateExpense(
  id: string,
  input: Partial<{
    description: string;
    amount: number;
    category: string;
    date: string;
    notes: string;
  }>
): Promise<void> {
  await api.put(`/expenses/${id}`, input);
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
