import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  private getClientAndRedirect(isMobile: boolean) {
    const clientId = isMobile
      ? process.env.GOOGLE_CLIENT_ID_MOBILE
      : process.env.GOOGLE_CLIENT_ID_WEB;

    const redirectUri = isMobile
      ? process.env.GOOGLE_CALLBACK_URL_MOBILE
      : process.env.GOOGLE_CALLBACK_URL;

    return { clientId, redirectUri };
  }

  // ✅ Generates Google login URL (web or Safari mobile)
  @Get('google')
  async googleAuth(@Req() req, @Res() res) {
    try {
      const isMobile = req.headers['mobile-auth'] === 'ios';
      const { clientId, redirectUri } = this.getClientAndRedirect(isMobile);

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;

      return res.json({ url: googleAuthUrl });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Failed to generate Google login URL' });
    }
  }

  // ✅ Handles Google redirect for web-based flow
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const user = req.user;
      const token = await this.authService.generateToken(user);
      const decoded = this.jwtService.decode(token) as { exp?: number } | null;
      const exp = decoded?.exp ?? null;

      const isMobile = req.headers['mobile-auth'] === 'ios';
      const redirectUrl = isMobile
        ? `coffeeclub://auth-callback?token=${token}&exp=${exp}&user=${encodeURIComponent(JSON.stringify(user))}`
        : `http://localhost:5173?token=${token}&exp=${exp}&user=${encodeURIComponent(JSON.stringify(user))}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // ✅ Used in Safari flow (if app or frontend uses code exchange)
  @Post('google/token')
  async exchangeToken(@Body() body, @Res() res) {
    try {
      const { code, isMobile } = body;
      const { clientId, redirectUri } = this.getClientAndRedirect(isMobile);

      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: clientId,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      });

      const { id_token } = response.data;
      const user = await this.authService.verifyGoogleToken(id_token, isMobile);
      const token = await this.authService.generateToken(user);

      const decoded = this.jwtService.decode(token) as { exp?: number } | null;
      const exp = decoded?.exp ?? null;
      const expiresAt = exp ? new Date(exp * 1000).toISOString() : null;

      return res.json({ token, exp, expiresAt, user });
    } catch (error) {
      console.error(
        'Token exchange error:',
        error.response?.data || error.message,
      );
      return res.status(400).json({ error: 'Failed to exchange token' });
    }
  }

  // ✅ Native mobile login using GoogleSignIn SDK (idToken)
  @Post('google/mobile')
  async googleAuthMobile(@Body('token') token: string, @Req() req, @Res() res) {
    try {
      const isMobile = req.headers['mobile-auth'] === 'ios';
      if (!isMobile) {
        return res
          .status(403)
          .json({ error: 'Unauthorized: Only mobile requests allowed' });
      }

      const user = await this.authService.verifyGoogleToken(token, true);
      const jwtToken = await this.authService.generateToken(user);

      const decoded = this.jwtService.decode(jwtToken) as {
        exp?: number;
      } | null;
      const exp = decoded?.exp ?? null;
      const expiresAt = exp ? new Date(exp * 1000).toISOString() : null;

      return res.json({ token: jwtToken, exp, expiresAt, user });
    } catch (error) {
      console.error(
        'Mobile token auth error:',
        error.response?.data || error.message,
      );
      return res.status(400).json({ error: 'Failed to verify mobile token' });
    }
  }
}
