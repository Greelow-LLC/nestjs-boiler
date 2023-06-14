import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from 'api-key/api-key.guard';
import { ApiKeyModule } from 'api-key/api-key.module';
import { AuthModule } from 'auth/auth.module';
import { IsAlreadyExistConstraint, IsNotExistConstraint } from 'decorators/';
import { FileUploaderModule } from 'file-uploader/file-uploader.module';
import { FirebaseModule } from 'firebase/firebase.module';
import { MulterConfigModule } from 'multer/multer-config.module';
import { PostModule } from 'post/post.module';
import { PostMediaModule } from 'post-media/post-media.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ProfileModule } from 'profile/profile.module';
import { UserModule } from 'user/user.module';

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
    FirebaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    IsAlreadyExistConstraint,
    IsNotExistConstraint,
  ],
})
export class AppModule {}
