import { IsOptional, IsString } from 'class-validator';
export class EditProfileDto {
  @IsOptional()
  @IsString({ message: 'First Name field must be a string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last Name field must be a string' })
  lastName?: string;
}
