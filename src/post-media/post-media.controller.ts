import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
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
import { ExistsByIdPipe } from 'pipes';
import { UploadImageDto } from 'post-media/dto';
import { PostMediaService } from 'post-media/post-media.service';

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
    @Param('postId', ParseIntPipe, ExistsByIdPipe) postId: PostModel['id'],
    @Param('key') key: PostMedia['key'],
    @GetUser('id') userId: User['id'],
  ) {
    return this.postMediaService.deleteImage(key, postId, userId);
  }
}
