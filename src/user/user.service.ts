import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { exclude } from 'src/helpers/utils';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: User['id']) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    return exclude<User>(user, 'password');
  }

  async editUser(userId: User['id'], dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });

    return exclude<User>(user, 'password');
  }
}
