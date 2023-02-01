import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './api-key/api-key.guard';
import { ApiKeyModule } from './api-key/api-key.module';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './posts/post.module';
import {
  IsAlreadyExistConstraint,
  IsNotExistConstraint,
} from './decorators/exists.decorator';
import { PostMediaModule } from './post-media/post-media.module';
import { MulterConfigModule } from './multer/multer-config.module';
import { FileUploaderService } from './file-uploader/file-uploader.service';
import { FileUploaderModule } from './file-uploader/file-uploader.module';

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
