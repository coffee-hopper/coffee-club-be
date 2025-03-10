import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OTP } from 'src/entities/otp.entity';
import { OTPService } from 'src/otp/otp.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    MikroOrmModule.forFeature([OTP]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, OTPService],
  exports: [AuthService],
})
export class AuthModule {}
