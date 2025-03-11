import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOneByUsername(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async validateGoogleUser(googleId: string, email: string) {
    const username = email.split('@')[0]; // Use email prefix as username
    const user = await this.userService.findByGoogleId(googleId);

    if (!user) {
      // Create new user if not exists
      return this.userService.create({
        username,
        googleId,
        googleEmail: email,
        role: 'user',
      });
    }

    return user;
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
        username: `user${Date.now()}`, // temporary username
        phone,
        role: 'user',
      });
    }

    return user;
  }

  async generateToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
