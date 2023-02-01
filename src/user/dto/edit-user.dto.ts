import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'A valid email is required' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password field must be a string' })
  @MinLength(6, { message: 'Password must be 6 characters or more' })
  password?: string;
}
