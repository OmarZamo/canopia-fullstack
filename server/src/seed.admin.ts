import { prisma } from './db/prisma';
import bcrypt from 'bcrypt';

async function run() {
  const password = await bcrypt.hash('Admin123!', 10);
  await prisma.users.upsert({
    where: { username: 'admin' },
    update: { password, role: 'ADMIN' },
    create: { username: 'admin', password, role: 'ADMIN' }
  });
  console.log('Admin listo: admin / Admin123!');
}
run().then(() => process.exit(0));
