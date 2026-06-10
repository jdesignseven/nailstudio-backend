import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const studioRouter = Router();
studioRouter.use(authenticate);

studioRouter.get('/', async (req: AuthRequest, res: Response) => {
  const studio = await prisma.studio.findUnique({
    where: { id: req.studioId },
    include: { users: { select: { id: true, name: true, email: true, role: true } } },
  });
  if (!studio) throw new AppError('Studio not found', 404);
  res.json(studio);
});

studioRouter.put('/', async (req: AuthRequest, res: Response) => {
  const { name, phone, address, pixKey, logoUrl, customPage } = req.body;
  const studio = await prisma.studio.update({
    where: { id: req.studioId },
    data: { name, phone, address, pixKey, logoUrl, customPage },
  });
  res.json(studio);
});

studioRouter.post('/professionals', async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'PROFESSIONAL',
      studioId: req.studioId!,
    },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(201).json(user);
});

studioRouter.get('/dashboard', async (req: AuthRequest, res: Response) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const studioId = req.studioId!;

  const [
    totalClients,
    monthRevenue,
    monthCompleted,
    monthScheduled,
    todayAppointments,
    monthExpenses,
  ] = await Promise.all([
    prisma.client.count({ where: { studioId } }),
    prisma.appointment.aggregate({
      where: { studioId, status: 'completed', date: { gte: monthStart, lte: monthEnd } },
      _sum: { depositAmount: true },
    }),
    prisma.appointment.count({
      where: { studioId, status: 'completed', date: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.appointment.count({
      where: { studioId, status: { in: ['scheduled', 'confirmed'] }, date: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.appointment.findMany({
      where: { studioId, date: { gte: todayStart, lte: todayEnd } },
      include: { client: true, service: true, user: { select: { id: true, name: true } } },
      orderBy: { date: 'asc' },
    }),
    prisma.expense.aggregate({
      where: { studioId, date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
  ]);

  const revenue = monthRevenue._sum.depositAmount || 0;
  const expenses = monthExpenses._sum.amount || 0;
  const profit = revenue - expenses;

  res.json({
    totalClients,
    monthRevenue: revenue,
    monthExpenses: expenses,
    monthProfit: profit,
    monthCompleted,
    monthScheduled,
    pending: monthScheduled,
    todayAppointments,
  });
});

interface MonthlyReport {
  year: number;
  month: number;
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
  completed: number;
  scheduled: number;
}

studioRouter.get('/reports/monthly', async (req: AuthRequest, res: Response) => {
  const months = Math.min(Math.max(parseInt(req.query.months as string) || 12, 1), 24);
  const studioId = req.studioId!;
  const now = new Date();

  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const promises: Promise<MonthlyReport>[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    promises.push(
      (async () => {
        const [revenueAgg, expensesAgg, completedCount, scheduledCount] = await Promise.all([
          prisma.appointment.aggregate({
            where: { studioId, status: 'completed', date: { gte: mStart, lte: mEnd } },
            _sum: { depositAmount: true },
          }),
          prisma.expense.aggregate({
            where: { studioId, date: { gte: mStart, lte: mEnd } },
            _sum: { amount: true },
          }),
          prisma.appointment.count({
            where: { studioId, status: 'completed', date: { gte: mStart, lte: mEnd } },
          }),
          prisma.appointment.count({
            where: { studioId, status: { in: ['scheduled', 'confirmed'] }, date: { gte: mStart, lte: mEnd } },
          }),
        ]);

        const revenue = revenueAgg._sum.depositAmount || 0;
        const expenses = expensesAgg._sum.amount || 0;

        return {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          label: monthLabels[d.getMonth()] + '/' + d.getFullYear().toString().slice(-2),
          revenue,
          expenses,
          profit: revenue - expenses,
          completed: completedCount,
          scheduled: scheduledCount,
        };
      })()
    );
  }

  const monthly = await Promise.all(promises);
  res.json(monthly);
});
