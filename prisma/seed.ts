// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create two dummy users

  const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
  const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {
      password: passwordSabin,
    },
    create: {
      email: 'sabin@adams.com',
      name: 'Sabin Adams',
      password: passwordSabin,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alex@ruheni.com' },
    update: {
      password: passwordAlex,
    },
    create: {
      email: 'alex@ruheni.com',
      name: 'Alex Ruheni',
      password: passwordAlex,
    },
  });

  // create two dummy articles
  const item1 = await prisma.item.upsert({
    where: { name: 'Test 1' },
    update: {
      userId: user1.id,
    },

    create: {
      name: 'Test 1',
      description: 'Test 1',
      price: 10.0,
      draft: true,
    },
  });

  const item2 = await prisma.item.upsert({
    where: { name: 'Test 2' },
    update: {
      userId: user2.id,
    },
    create: {
      name: 'Test 2',
      description: 'Test 2',
      price: 12.12,
      draft: false,
    },
  });

  const item3 = await prisma.item.upsert({
    where: { name: 'Test 3' },
    update: {},
    create: {
      name: 'Test 3',
      description:
        'This article will explore various ways you can use Prisma Client extensions to add custom functionality to Prisma Client..',
      price: 15.34,
      draft: false,
    },
  });

  console.log({ user1, user2, item1, item2, item3 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
