import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route to get Google OAuth URL (Works for Web & Mobile)
  @Get('google')
  async googleAuth(@Req() req, @Res() res) {
    try {
      const isMobile = req.query.mobile === 'true';

      const redirectUri = isMobile
        ? process.env.GOOGLE_CALLBACK_URL_MOBILE
        : process.env.GOOGLE_CALLBACK_URL;

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;

      return res.json({ url: googleAuthUrl });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Failed to generate Google login URL' });
    }
  }

  // Callback for Google OAuth (Handles Web & Mobile)
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

  // Token Exchange API (For Mobile Apps)
  @Post('google/token')
  async exchangeToken(@Body() body, @Res() res) {
    try {
      const { code, isMobile } = body;

      // Set correct redirect URI based on mobile or web
      const redirectUri = isMobile
        ? process.env.GOOGLE_CALLBACK_URL_MOBILE
        : process.env.GOOGLE_CALLBACK_URL;

      // Exchange the authorization code for an access token
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      });

      const { id_token } = response.data;

      // Verify and extract user information
      const user = await this.authService.verifyGoogleToken(id_token);

      // Generate JWT token
      const token = await this.authService.generateToken(user);

      return res.json({ token, user });
    } catch (error) {
      console.error(
        'Token exchange error:',
        error.response?.data || error.message,
      );
      return res.status(400).json({ error: 'Failed to exchange token' });
    }
  }
}

/*

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
}


*/
