import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OTPService } from 'src/otp/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OTPService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const user = req.user;
      const token = await this.authService.generateToken(user);
      // Redirect to your React app with the token and user data
      return res.redirect(
        `http://localhost:5173?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`,
      );
    } catch (error) {
      // Redirect with error
      return res.redirect(
        `http://localhost:5173?error=${encodeURIComponent(error.message)}`,
      );
    }
  }

  @Post('phone/request-otp')
  async requestOTP(@Body() body: { phone: string }) {
    await this.otpService.createOTP(body.phone);
    return { message: 'OTP sent successfully' };
  }

  @Post('phone/verify-otp')
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
