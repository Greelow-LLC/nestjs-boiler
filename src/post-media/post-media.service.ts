import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MediaType, User } from '@prisma/client';
import { FileUploaderService } from 'file-uploader/file-uploader.service';
import { DeleteImagesDto, UploadImagesDto } from 'post-media/dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostMediaService {
  constructor(
    private prisma: PrismaService,
    private fileUploaderService: FileUploaderService,
  ) {}

  async uploadImages(
    images: Express.Multer.File[],
    dto: UploadImagesDto,
    userId: User['id'],
  ) {
    const { profile } = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const post = await this.prisma.post.findFirst({
      where: { authorId: profile.id, id: dto.postId },
    });

    if (!post)
      throw new UnauthorizedException(
        'You are not authorized to do this action',
      );

    const results = await this.fileUploaderService.uploadFiles(images);

    await this.prisma.postMedia.createMany({
      data: results.map(({ Key, Location }) => ({
        key: Key,
        src: Location,
        postId: dto.postId,
        type: MediaType.IMAGE,
        alt: dto.alt,
      })),
    });

    return { images };
  }

  async deleteImages(dto: DeleteImagesDto, userId: User['id']) {
    const { profile } = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { profile: true },
    });

    const post = await this.prisma.post.findFirst({
      include: { medias: true },
      where: { authorId: profile.id, id: dto.postId },
    });

    if (!post)
      throw new UnauthorizedException(
        'You are not authorized to do this action',
      );

    const postMedias = await this.prisma.postMedia.findMany({
      where: { key: { in: dto.keys }, postId: post.id },
    });

    if (!postMedias.length)
      throw new UnauthorizedException(
        'You are not authorized to do this action',
      );

    await this.prisma.postMedia.deleteMany({
      where: { id: { in: postMedias.map(({ id }) => id) } },
    });

    await this.fileUploaderService.deleteFiles(dto.keys);

    return { images: postMedias };
  }
}
