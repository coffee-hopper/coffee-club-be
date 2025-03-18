import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleAuth(@Req() req, @Res() res) {
    try {
      const redirectUri = 'coffee-club://auth-callback';

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;

      return res.json({ url: googleAuthUrl });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Failed to generate Google login URL' });
    }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const user = req.user;
      const token = await this.authService.generateToken(user);

      const isMobile =
        req.headers['user-agent']?.includes('Expo') ||
        req.query.mobile === 'true';

      if (isMobile) {
        return res.json({ token, user });
      }

      return res.redirect(
        `http://localhost:5173?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`,
      );
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
