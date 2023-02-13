import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Post as PostModel, PostMedia, Role, User } from '@prisma/client';
import { GetUser, Roles } from 'auth/decorators';
import { RolesGuard, JwtGuard } from 'auth/guards';
import { RemoveFilesInterceptor } from 'interceptors';
import { imageValidator } from 'multer/validators';
// import { ExistsPipe } from 'pipes';
import { UploadImageDto } from 'post-media/dto';
import { PostMediaService } from 'post-media/post-media.service';
import { PrismaService } from 'prisma/prisma.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('posts-media')
export class PostMediaController {
  constructor(private postMediaService: PostMediaService) {}

  @Post('/image/upload')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'), RemoveFilesInterceptor)
  uploadImage(
    @UploadedFile(imageValidator)
    image: Express.Multer.File,
    @Body() dto: UploadImageDto,
    @GetUser('id') userId: User['id'],
  ) {
    return this.postMediaService.uploadImage(image, dto, userId);
  }

  @Delete('/image/delete/:key/:postId')
  @Roles(Role.ADMIN)
  deleteImage(
    // @Param(new ExistsPipe(PostModel))
    // params: { key: PostMedia['key']; postId: PostModel['id'] },
    @GetUser('id') userId: User['id'],
  ) {
    // console.log(params);
    // return { params };
    // return this.postMediaService.deleteImage(dto, userId);
  }
}
