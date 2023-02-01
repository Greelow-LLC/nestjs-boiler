import { Module } from '@nestjs/common';
import { PostMediaService } from './post-media.service';
import { PostMediaController } from './post-media.controller';

@Module({
  providers: [PostMediaService],
  controllers: [PostMediaController],
})
export class PostMediaModule {}
