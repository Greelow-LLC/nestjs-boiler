import { Module } from '@nestjs/common';
import { PostMediaController } from 'src/post-media/post-media.controller';
import { PostMediaService } from 'src/post-media/post-media.service';

@Module({
  providers: [PostMediaService],
  controllers: [PostMediaController],
})
export class PostMediaModule {}
