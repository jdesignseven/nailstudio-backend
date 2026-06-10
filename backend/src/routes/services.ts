import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const serviceRouter = Router();
serviceRouter.use(authenticate);

serviceRouter.get('/', async (req: AuthRequest, res: Response) => {
  const { status, category } = req.query;
  const where: any = { studioId: req.studioId };
  if (status === 'active') where.active = true;
  if (status === 'inactive') where.active = false;
  if (category && category !== 'all') where.category = category;
  const services = await prisma.service.findMany({
    where,
    orderBy: { name: 'asc' },
  });
  res.json(services);
});

serviceRouter.post('/', async (req: AuthRequest, res: Response) => {
  const { name, description, price, duration, category, active } = req.body;
  const service = await prisma.service.create({
    data: {
      name, description, price, duration, category,
      active: active ?? true,
      studioId: req.studioId!,
    },
  });
  res.status(201).json(service);
});

serviceRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, description, price, duration, category, active } = req.body;
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = price;
  if (duration !== undefined) data.duration = duration;
  if (category !== undefined) data.category = category;
  if (active !== undefined) data.active = active;
  const service = await prisma.service.updateMany({
    where: { id, studioId: req.studioId },
    data,
  });
  if (service.count === 0) throw new AppError('Service not found', 404);
  res.json({ message: 'Updated' });
});

serviceRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.service.deleteMany({
    where: { id, studioId: req.studioId },
  });
  res.json({ message: 'Deleted' });
});
