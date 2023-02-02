import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from 'src/post/dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
