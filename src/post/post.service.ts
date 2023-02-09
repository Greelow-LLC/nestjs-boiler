import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UpdatePostDto, CreatePostDto } from 'post/dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: User['id'], dto: CreatePostDto) {
    const author = await this.prisma.profile.findUnique({ where: { userId } });

    return this.prisma.post.create({
      data: {
        ...dto,
        authorId: author.id,
      },
    });
  }

  async getPosts(userId: User['id'] | null = null) {
    const profile =
      userId && (await this.prisma.profile.findUnique({ where: { userId } }));

    if (userId !== null && !profile)
      throw new ForbiddenException("User doesn't exist");

    return this.prisma.post.findMany({
      where: {
        ...(userId && { authorId: profile.id }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        medias: true,
      },
    });
  }

  getPost(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async editPost(id: number, dto: UpdatePostDto, user: User) {
    const postToEdit = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!postToEdit) throw new ForbiddenException("Post doesn't exist");

    if (postToEdit.author.userId !== user.id)
      throw new ForbiddenException('You are not authorized to do this action');

    return this.prisma.post.update({
      where: { id: postToEdit.id },
      data: { ...dto },
    });
  }

  async deletePost(id: number, user: User) {
    const postToDelete = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!postToDelete) throw new ForbiddenException("Post doesn't exist");

    if (postToDelete.author.userId !== user.id)
      throw new ForbiddenException('You are not authorized to do this action');

    return this.prisma.post.delete({ where: { id: postToDelete.id } });
  }
}
