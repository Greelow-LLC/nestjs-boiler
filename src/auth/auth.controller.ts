import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { SigninDto, SignupDto } from 'auth/dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { profile, token } = await this.authService.signup(dto);

    this.signCookie(res, token);

    return { profile, token };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signin(dto);

    this.signCookie(res, token);

    return { token };
  }

  @Get('signout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token-boiler', '', { expires: new Date() });
    return { success: true };
  }

  signCookie(res: Response, token: string) {
    return res.cookie('token-boiler', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365 * 1000,
    });
  }
}
