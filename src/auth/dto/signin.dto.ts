import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString({ message: 'A valid token is required' })
  token: string;
}
