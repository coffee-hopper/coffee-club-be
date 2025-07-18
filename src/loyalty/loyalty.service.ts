import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';

import { Loyalty } from '../entities/loyalty.entity';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(Loyalty)
    private readonly loyaltyRepo: EntityRepository<Loyalty>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Loyalty[]> {
    return this.loyaltyRepo.findAll({ populate: ['user', 'product'] });
  }

  async addEntry(data: Partial<Loyalty>): Promise<Loyalty> {
    const entry = this.loyaltyRepo.create(data);
    await this.em.persistAndFlush(entry);
    return entry;
  }

  async getUserStars(userId: number): Promise<{
    stars: number;
    rewards: number;
    remainingToNext: number;
    requiredStars: number;
  }> {
    const entries = await this.loyaltyRepo.find({ user: userId });
    const stars = entries.reduce((sum, e) => sum + e.points, 0);
    const requiredStars = 15;
    const rewards = Math.floor(stars / requiredStars);
    const remainingToNext = requiredStars - (stars % requiredStars);

    return { stars, rewards, remainingToNext, requiredStars };
  }
}
