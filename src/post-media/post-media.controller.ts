import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Role, User } from '@prisma/client';
import { GetUser, Roles } from 'auth/decorators';
import { RolesGuard, JwtGuard } from 'auth/guards';
import { RemoveFilesInterceptor } from 'interceptors';
import { imageValidator } from 'multer/validators';
import { DeleteImagesDto, UploadImagesDto } from 'post-media/dto';
import { PostMediaService } from 'post-media/post-media.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('posts-media')
export class PostMediaController {
  constructor(private postMediaService: PostMediaService) {}

  @Post('/upload-images')
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'), RemoveFilesInterceptor)
  uploadImages(
    @UploadedFiles(imageValidator)
    images: Express.Multer.File[],
    @Body() dto: UploadImagesDto,
    @GetUser('id') userId: User['id'],
  ) {
    return this.postMediaService.uploadImages(images, dto, userId);
  }

  @Post('/delete-images')
  @Roles(Role.ADMIN)
  deleteImages(
    @Body() dto: DeleteImagesDto,
    @GetUser('id') userId: User['id'],
  ) {
    return this.postMediaService.deleteImages(dto, userId);
  }
}
