import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from 'src/api-key/api-key.guard';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { AuthModule } from 'src/auth/auth.module';
import {
  IsAlreadyExistConstraint,
  IsNotExistConstraint,
} from 'src/decorators/';
import { FileUploaderModule } from 'src/file-uploader/file-uploader.module';
import { FileUploaderService } from 'src/file-uploader/file-uploader.service';
import { MulterConfigModule } from 'src/multer/multer-config.module';
import { PostModule } from 'src/post/post.module';
import { PostMediaModule } from 'src/post-media/post-media.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileModule } from 'src/profile/profile.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterConfigModule,
    FileUploaderModule,
    ApiKeyModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ProfileModule,
    PostModule,
    PostMediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    IsAlreadyExistConstraint,
    IsNotExistConstraint,
    FileUploaderService,
  ],
})
export class AppModule {}
