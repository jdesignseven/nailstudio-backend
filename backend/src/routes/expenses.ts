import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const expenseRouter = Router();
expenseRouter.use(authenticate);

expenseRouter.get('/', async (req: AuthRequest, res: Response) => {
  const { dateFrom, dateTo, category } = req.query;
  const where: any = { studioId: req.studioId };
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom as string);
    if (dateTo) where.date.lte = new Date(dateTo as string);
  }
  if (category) where.category = category;
  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });
  res.json(expenses);
});

expenseRouter.post('/', async (req: AuthRequest, res: Response) => {
  const { description, amount, category, date, notes } = req.body;
  const expense = await prisma.expense.create({
    data: {
      description,
      amount,
      category: category || 'Operacionais',
      date: new Date(date),
      notes,
      studioId: req.studioId!,
    },
  });
  res.status(201).json(expense);
});

expenseRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { description, amount, category, date, notes } = req.body;
  const data: any = {};
  if (description !== undefined) data.description = description;
  if (amount !== undefined) data.amount = amount;
  if (category !== undefined) data.category = category;
  if (date !== undefined) data.date = new Date(date);
  if (notes !== undefined) data.notes = notes;
  const result = await prisma.expense.updateMany({
    where: { id, studioId: req.studioId },
    data,
  });
  if (result.count === 0) throw new AppError('Expense not found', 404);
  res.json({ message: 'Updated' });
});

expenseRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.expense.deleteMany({
    where: { id, studioId: req.studioId },
  });
  res.json({ message: 'Deleted' });
});
