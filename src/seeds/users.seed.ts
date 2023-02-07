import { PrismaClient, Role } from '@prisma/client';
import * as argon from 'argon2';

export const seedUsers = async (prisma: PrismaClient) => {
  const password = await argon.hash('123456');

  return Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@gmail.com' },
      update: {},
      create: {
        email: 'admin@gmail.com',
        password,
        roles: Role.ADMIN,
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'Greelow',
            posts: {
              create: {
                title: 'Post',
              },
            },
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'nico@nico1.com' },
      update: {},
      create: {
        email: 'nico@nico1.com',
        password,
        roles: [Role.USER, Role.ADMIN],
        profile: {
          create: {
            firstName: 'Nico',
            lastName: 'Joaquin',
            posts: {
              create: {
                title: 'Post nico',
              },
            },
          },
        },
      },
    }),
  ]);
};
