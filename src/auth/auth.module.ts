import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { JwtStrategy } from 'auth/strategy';
import { FirebaseModule } from 'firebase/firebase.module';

@Module({
  imports: [JwtModule.register({}), FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
