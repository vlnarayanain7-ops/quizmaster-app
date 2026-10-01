import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Gamification User
  const user = await prisma.user.upsert({
    where: { email: 'admin@quizmaster.com' },
    update: {},
    create: {
      email: 'admin@quizmaster.com',
      password: 'password123',
      name: 'Demo Student',
      role: 'ADMIN',
      xp: 1500,
      level: 5,
      streak: 7
    }
  });
  console.log('Seeded User:', user.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
