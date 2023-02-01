import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, GetPostsDto } from './dto';
import { UpdatePostDto } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { Public, GetUser } from '../auth/decorators';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  createPost(@GetUser('id') userId: User['id'], @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Public()
  @Get()
  getPosts(@Query() query?: GetPostsDto) {
    const { user = null } = query;
    return this.postService.getPosts(user && +user);
  }

  @Public()
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPost(id);
  }

  @Put('update/:id')
  editPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    return this.postService.editPost(id, dto, user);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.postService.deletePost(id, user);
  }
}
