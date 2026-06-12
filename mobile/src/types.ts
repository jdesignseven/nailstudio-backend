export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "OWNER" | "ADMIN" | "PROFESSIONAL";
  studioId?: string;
}

export interface Studio {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  pixKey?: string;
  customPage: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  notes?: string;
  studioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  photoUrl?: string;
  active: boolean;
  studioId: string;
}

export interface Appointment {
  id: string;
  date: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes?: string;
  clientId: string;
  client: Client;
  serviceId: string;
  service: Service;
  userId: string;
  user: { id: string; name: string };
  studioId: string;
  depositPaid: boolean;
  depositAmount?: number;
  totalPaid: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  studioId: string;
}

export interface DashboardData {
  totalClients: number;
  monthRevenue: number;
  monthExpenses: number;
  monthProfit: number;
  monthCompleted: number;
  monthScheduled: number;
  pending: number;
  todayAppointments: Appointment[];
}
