import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    console.log('process.env.GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID);

    super({
      clientID: process.env.GOOGLE_CLIENT_ID_WEB,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, photos } = profile;
    const user = await this.authService.validateGoogleUser(
      id,
      emails[0].value,
      photos?.[0]?.value,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    done(null, user);
  }
}
