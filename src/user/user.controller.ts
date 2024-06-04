import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | null> {
    return this.usersService.findOneByUsername(username);
  }
}
