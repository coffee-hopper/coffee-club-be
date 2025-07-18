import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OTP } from 'src/entities/otp.entity';
import { OTPService } from 'src/otp/otp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([OTP]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, OTPService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
