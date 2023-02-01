import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsAlreadyExist } from 'src/decorators';

export class SignupDto {
  @IsNotEmpty({ message: 'Email field is required' })
  @IsEmail({}, { message: 'A valid email is required' })
  @IsAlreadyExist({ model: 'user' }, { message: 'User already exists' })
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  @IsString({ message: 'Password field must be a string' })
  @MinLength(6, { message: 'Password must be 6 characters or more' })
  password: string;

  @IsNotEmpty({ message: 'First Name field is required' })
  @IsString({ message: 'First Name field must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name field is required' })
  @IsString({ message: 'Last Name field must be a string' })
  lastName: string;
}
