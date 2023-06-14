import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { SigninDto, SignupDto } from 'auth/dto';
import { FirebaseService } from 'firebase/firebase.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private firebase: FirebaseService,
  ) {}

  async signup(dto: SignupDto) {
    const password = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
      },
    });

    const profile = await this.prisma.profile.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        userId: user.id,
      },
    });

    const token = await this.signToken(user.id, user.email);

    return { profile, token };
  }

  async signin(dto: SigninDto) {
    const decodedToken = await this.firebase.getAuth().verifyIdToken(dto.token);
    console.log(decodedToken);

    const user = await this.prisma.user.findUnique({
      where: { email: decodedToken.email },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const token = await this.signToken(user.id, decodedToken.email);
    return token;
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.sign(payload, {
      expiresIn: '48h',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
