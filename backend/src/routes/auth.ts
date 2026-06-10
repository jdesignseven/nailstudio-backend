import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, studioName } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use', 409);

  const hashed = await bcrypt.hash(password, 10);

  const studio = await prisma.studio.create({
    data: { name: studioName || `${name}'s Studio` },
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'OWNER',
      studioId: studio.id,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    studio: { id: studio.id, name: studio.name },
  });
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  const studio = user.studioId
    ? await prisma.studio.findUnique({ where: { id: user.studioId } })
    : null;

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studioId: user.studioId,
    },
    studio: studio ? { id: studio.id, name: studio.name } : null,
  });
});

authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, phone: true, role: true, studioId: true },
  });

  const studio = user?.studioId
    ? await prisma.studio.findUnique({ where: { id: user.studioId } })
    : null;

  res.json({ user, studio });
});
