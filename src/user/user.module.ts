import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserRepository],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
