import { Post } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsNotExist } from 'decorators';

export class UploadImageDto {
  @IsOptional()
  @IsString({ message: 'Alt field must be a string' })
  alt?: string;

  @IsNumber({}, { message: 'Post id field must be a valid id(number)' })
  @IsNotExist<Post>(
    { model: 'post', fieldToValidate: 'id' },
    { message: "Post doesn't exist" },
  )
  postId?: number;
}
