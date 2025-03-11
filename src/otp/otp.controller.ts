import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { OTPService } from './otp.service';
import { AuthService } from '../auth/auth.service';

@Controller('otp')
export class OTPController {
  constructor(
    private readonly otpService: OTPService,
    private readonly authService: AuthService,
  ) {}

  @Post('request')
  async requestOTP(@Body() body: { phone: string }) {
    await this.otpService.createOTP(body.phone);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify')
  async verifyOTP(@Body() body: { phone: string; code: string }) {
    const isValid = await this.otpService.verifyOTP(body.phone, body.code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Create or update user
    const user = await this.authService.findOrCreateUserByPhone(body.phone);

    // Generate JWT token
    const token = await this.authService.generateToken(user);

    return { token, user };
  }
}
