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

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByGoogleId(googleId: string) {
    return this.userRepository.findOne({ googleId });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      $or: [{ email }, { googleEmail: email }],
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  async findByPhone(phone: string) {
    return this.userRepository.findOne({ phone });
  }

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    await this.em.persistAndFlush(user);
    return user;
  }

  async update(id: number, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new Error('User not found');
    }

    this.userRepository.assign(user, updateData);
    await this.em.persistAndFlush(user);
    return user;
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    await this.em.persistAndFlush(user);
    return user;
  }
}
