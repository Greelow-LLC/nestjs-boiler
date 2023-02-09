import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title field is required' })
  @IsString({ message: 'Title field must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'content field must be a string' })
  content?: string;
}
