import { Module } from '@nestjs/common';
import { PostController } from 'src/post/post.controller';
import { PostService } from 'src/post/post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
