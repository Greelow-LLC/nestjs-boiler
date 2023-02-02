import { Module } from '@nestjs/common';
import { ProfileController } from 'src/profile/profile.controller';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
