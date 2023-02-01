import { Profile } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { IsNotExist } from 'src/decorators';

export class GetPostsDto {
  @IsOptional()
  @IsNumber({}, { message: 'User id field must be a valid id(number)' })
  @IsNotExist<Profile>(
    { model: 'profile', fieldToValidate: 'userId' },
    { message: "User doesn't exist" },
  )
  user?: number;
}
