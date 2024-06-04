import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
