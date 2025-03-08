import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const user = req.user;
      // Redirect to your React app with the user data
      return res.redirect(
        `http://localhost:5173?user=${encodeURIComponent(JSON.stringify(user))}`,
      );
    } catch (error) {
      // Redirect with error
      return res.redirect(
        `http://localhost:5173?error=${encodeURIComponent(error.message)}`,
      );
    }
  }
}
