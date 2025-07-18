import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleId: string, email: string, picture?: string) {
    const username = email.split('@')[0];
    const user = await this.userService.findByGoogleId(googleId);

    if (!user) {
      return this.userService.create({
        username,
        googleId,
        googleEmail: email,
        googlePicture: picture,
        role: 'user',
      });
    }

    if (picture && user.googlePicture !== picture) {
      await this.userService.update(user.id, { googlePicture: picture });
      user.googlePicture = picture;
    }

    return user;
  }

  async verifyGoogleToken(idToken: string, isMobile = false) {
    try {
      const audience = isMobile
        ? process.env.GOOGLE_CLIENT_ID_MOBILE
        : process.env.GOOGLE_CLIENT_ID_WEB;

      const client = new OAuth2Client(); // instantiate without preset clientId
      const ticket = await client.verifyIdToken({ idToken, audience });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google Token');
      }

      return this.validateGoogleUser(
        payload.sub,
        payload.email,
        payload.picture,
      );
    } catch (error) {
      throw new UnauthorizedException('Failed to verify Google Token');
    }
  }

  async generateToken(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findOrCreateUserByPhone(phone: string) {
    let user = await this.userService.findByPhone(phone);

    if (!user) {
      user = await this.userService.create({
        username: `user${Date.now()}`,
        phone,
        role: 'user',
      });
    }

    return user;
  }
}
