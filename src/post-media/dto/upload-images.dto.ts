import { Post } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsNotExist } from 'src/decorators';

export class UploadImagesDto {
  @IsOptional()
  @IsString({ message: 'Alt field must be a string' })
  alt?: string;

  @IsNotEmpty({ message: 'Post id field is required' })
  @IsNumber({}, { message: 'Post id field must be a valid id(number)' })
  @IsNotExist<Post>(
    { model: 'post', fieldToValidate: 'id' },
    { message: "Post doesn't exist" },
  )
  postId: number;
}
