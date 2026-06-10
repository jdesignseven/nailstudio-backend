import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@nailstudio.com' } });
  if (existing) {
    console.log('Seed user already exists, skipping.');
    return;
  }

  const studio = await prisma.studio.create({
    data: { name: 'Meu Estúdio' },
  });

  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@nailstudio.com',
      password,
      role: 'PROFESSIONAL',
      studioId: studio.id,
    },
  });

  console.log(`Seed created: ${user.email} / 123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
