import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { ProfileService } from './profile.service';
import { JwtGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators/user.decorator';
import { EditProfileDto } from './dto';

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
