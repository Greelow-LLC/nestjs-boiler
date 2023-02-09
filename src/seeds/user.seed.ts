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
                content:
                  'Quaerat provident commodi consectetur veniam similique ad earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore suscipit quas? Nulla, placeat.',
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
                content:
                  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore etdolore magnam aliquam quaerat voluptatem.',
              },
            },
          },
        },
      },
    }),
  ]);
};
