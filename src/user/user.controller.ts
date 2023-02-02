import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { EditUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-one')
  getUser(@GetUser('id') userId: UserModel['id']) {
    return this.userService.getUser(userId);
  }

  @Put('update')
  editUser(@GetUser('id') userId: UserModel['id'], @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
