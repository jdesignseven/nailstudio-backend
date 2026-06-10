import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const clientRouter = Router();
clientRouter.use(authenticate);

clientRouter.get('/', async (req: AuthRequest, res: Response) => {
  const clients = await prisma.client.findMany({
    where: { studioId: req.studioId },
    orderBy: { name: 'asc' },
  });
  res.json(clients);
});

clientRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const client = await prisma.client.findFirst({
    where: { id, studioId: req.studioId },
    include: { anamnesis: true, appointments: { include: { service: true }, orderBy: { date: 'desc' }, take: 10 } },
  });
  if (!client) throw new AppError('Client not found', 404);
  res.json(client);
});

clientRouter.post('/', async (req: AuthRequest, res: Response) => {
  const { name, phone, email, notes } = req.body;
  const client = await prisma.client.create({
    data: { name, phone, email, notes, studioId: req.studioId! },
  });
  res.status(201).json(client);
});

clientRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, phone, email, notes } = req.body;
  const client = await prisma.client.updateMany({
    where: { id, studioId: req.studioId },
    data: { name, phone, email, notes },
  });
  if (client.count === 0) throw new AppError('Client not found', 404);
  res.json({ message: 'Updated' });
});

clientRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.client.deleteMany({
    where: { id, studioId: req.studioId },
  });
  res.json({ message: 'Deleted' });
});

clientRouter.post('/:id/anamnesis', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { allergies, conditions, medications, pregnant, diabetes } = req.body;
  const client = await prisma.client.findFirst({
    where: { id, studioId: req.studioId },
  });
  if (!client) throw new AppError('Client not found', 404);

  const anamnesis = await prisma.anamnesis.upsert({
    where: { clientId: id },
    update: { allergies, conditions, medications, pregnant, diabetes },
    create: { clientId: id, allergies, conditions, medications, pregnant, diabetes },
  });
  res.json(anamnesis);
});
