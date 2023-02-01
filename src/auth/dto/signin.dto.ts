import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsNotEmpty({ message: 'Email field is required' })
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  @IsString({ message: 'Password field must be a string' })
  password: string;
}
