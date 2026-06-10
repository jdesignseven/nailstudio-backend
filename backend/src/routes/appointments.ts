import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const appointmentRouter = Router();
appointmentRouter.use(authenticate);

appointmentRouter.get('/', async (req: AuthRequest, res: Response) => {
  const { date, dateFrom, dateTo, professional, status } = req.query;
  const where: any = { studioId: req.studioId };

  if (dateFrom && dateTo) {
    where.date = {
      gte: new Date(dateFrom as string),
      lte: new Date(dateTo as string),
    };
  } else if (date) {
    const start = new Date(date as string);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    where.date = { gte: start, lt: end };
  }
  if (professional) where.userId = professional as string;
  if (status) where.status = status as string;

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      client: true,
      service: true,
      user: { select: { id: true, name: true } },
    },
    orderBy: { date: 'asc' },
  });
  res.json(appointments);
});

appointmentRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const appointment = await prisma.appointment.findFirst({
    where: { id, studioId: req.studioId },
    include: { client: true, service: true, user: { select: { id: true, name: true } } },
  });
  if (!appointment) throw new AppError('Appointment not found', 404);
  res.json(appointment);
});

appointmentRouter.post('/', async (req: AuthRequest, res: Response) => {
  const { clientId, serviceId, userId, date, notes, depositAmount } = req.body;

  const appointment = await prisma.appointment.create({
    data: {
      clientId,
      serviceId,
      userId,
      studioId: req.studioId!,
      date: new Date(date),
      notes,
      depositAmount,
    },
    include: { client: true, service: true, user: { select: { id: true, name: true } } },
  });
  res.status(201).json(appointment);
});

appointmentRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { date, status, notes, depositPaid, totalPaid, depositAmount } = req.body;
  const appointment = await prisma.appointment.updateMany({
    where: { id, studioId: req.studioId },
    data: {
      ...(date && { date: new Date(date) }),
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
      ...(depositPaid !== undefined && { depositPaid }),
      ...(totalPaid !== undefined && { totalPaid }),
      ...(depositAmount !== undefined && { depositAmount }),
    },
  });
  if (appointment.count === 0) throw new AppError('Appointment not found', 404);
  res.json({ message: 'Updated' });
});

appointmentRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.appointment.deleteMany({
    where: { id, studioId: req.studioId },
  });
  res.json({ message: 'Deleted' });
});
