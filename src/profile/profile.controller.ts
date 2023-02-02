import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { EditProfileDto } from 'src/profile/dto';
import { ProfileService } from 'src/profile/profile.service';

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
