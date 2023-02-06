import { Post } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNotExist } from 'decorators';

export class DeleteImagesDto {
  @IsNotEmpty({ message: 'Keys field is required' })
  @IsString({ each: true, message: 'All keys must be a string' })
  keys: string[];

  @IsNotEmpty({ message: 'Post id field is required' })
  @IsNumber({}, { message: 'Post id field must be a valid id(number)' })
  @IsNotExist<Post>(
    { model: 'post', fieldToValidate: 'id' },
    { message: "Post doesn't exist" },
  )
  postId: number;
}
