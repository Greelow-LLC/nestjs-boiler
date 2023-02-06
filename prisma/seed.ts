import { PrismaClient } from '@prisma/client';
import { seedUsers } from 'seeds/users.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
