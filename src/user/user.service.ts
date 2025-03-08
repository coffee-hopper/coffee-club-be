import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { EntityRepository, EntityManager } from '@mikro-orm/core';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findByGoogleId(googleId: string) {
    return this.userRepository.findOne({ googleId });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      $or: [{ email }, { googleEmail: email }],
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    await this.em.persistAndFlush(user);
    return user;
  }
}
