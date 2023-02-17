import { Injectable, ForbiddenException } from '@nestjs/common';
import { MediaType, Post, PostMedia, User } from '@prisma/client';
import { FileUploaderService } from 'file-uploader/file-uploader.service';
import { UploadImageDto } from 'post-media/dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostMediaService {
  constructor(
    private prisma: PrismaService,
    private fileUploaderService: FileUploaderService,
  ) {}

  async uploadImage(
    image: Express.Multer.File,
    dto: UploadImageDto,
    userId: User['id'],
  ) {
    const { profile } = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const post = await this.prisma.post.findFirst({
      where: { authorId: profile.id, id: +dto.postId },
    });

    if (!post)
      throw new ForbiddenException('You are not authorized to do this action');

    const { Key, Location } = await this.fileUploaderService.uploadFile(image);

    const postMedia = await this.prisma.postMedia.create({
      data: {
        key: Key,
        src: Location,
        postId: +dto.postId,
        type: MediaType.IMAGE,
        alt: dto.alt,
      },
    });

    return { image, postMedia };
  }

  async deleteImage(
    key: PostMedia['key'],
    postId: Post['id'],
    userId: User['id'],
  ) {
    const { profile } = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { profile: true },
    });

    const post = await this.prisma.post.findFirst({
      include: { medias: true },
      where: { authorId: profile.id, id: postId },
    });

    if (!post)
      throw new ForbiddenException('You are not authorized to do this action');

    const postMedia = await this.prisma.postMedia.findFirst({
      where: { key, postId: post.id },
    });

    if (!postMedia)
      throw new ForbiddenException('You are not authorized to do this action');

    await this.prisma.postMedia.delete({
      where: { id: postMedia.id },
    });

    await this.fileUploaderService.deleteFile(key);

    return { images: postMedia };
  }

  async deleteImages(
    keys: PostMedia['key'][],
    postId: Post['id'],
    userId: User['id'],
  ) {
    const { profile } = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { profile: true },
    });

    const post = await this.prisma.post.findFirst({
      include: { medias: true },
      where: { authorId: profile.id, id: postId },
    });

    if (!post)
      throw new ForbiddenException('You are not authorized to do this action');

    const postMedias = await this.prisma.postMedia.findMany({
      where: { key: { in: keys }, postId: post.id },
    });

    if (!postMedias.length)
      throw new ForbiddenException('You are not authorized to do this action');

    await this.prisma.postMedia.deleteMany({
      where: { id: { in: postMedias.map(({ id }) => id) } },
    });

    await this.fileUploaderService.deleteFiles(keys);

    return { images: postMedias };
  }
}
