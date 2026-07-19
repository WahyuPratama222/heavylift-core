import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'owner@heavylift.com' },
    update: {},
    create: {
      email: 'owner@heavylift.com',
      password: hashedPassword,
      role: 'owner',
    },
  });

  console.log('Seeder berhasil dijalankan');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });