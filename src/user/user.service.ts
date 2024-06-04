import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ googleId });
  }

  async createUserWithGoogle(
    googleId: string,
    googleEmail: string,
  ): Promise<User> {
    const user = new User();
    user.googleId = googleId;
    user.googleEmail = googleEmail;
    user.role = 'user'; // Default role
    await this.em.persistAndFlush(user);
    return user;
  }
}
