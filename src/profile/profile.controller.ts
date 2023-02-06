import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { GetUser } from 'auth/decorators';
import { JwtGuard } from 'auth/guards';
import { EditProfileDto } from 'profile/dto';
import { ProfileService } from 'profile/profile.service';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getProfile(@GetUser('id') userId: UserModel['id']) {
    return this.profileService.getProfile(userId);
  }

  @Put('update')
  editProfile(
    @GetUser('id') userId: UserModel['id'],
    @Body() dto: EditProfileDto,
  ) {
    return this.profileService.editProfile(userId, dto);
  }
}
