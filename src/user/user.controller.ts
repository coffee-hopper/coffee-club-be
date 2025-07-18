import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AdminOnlyGuard } from 'src/auth/guards/admin-only.guard';

@UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get(':email')
  async getByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  async updateUserRole(
    @Param('id') id: number,
    @Body('role') role: string,
  ): Promise<User> {
    return this.usersService.updateUserRole(Number(id), role);
  }
}
