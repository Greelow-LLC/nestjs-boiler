import { Module } from '@nestjs/common';
import { PostController } from 'post/post.controller';
import { PostService } from 'post/post.service';
import { PostMediaService } from 'post-media/post-media.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostMediaService],
})
export class PostModule {}
