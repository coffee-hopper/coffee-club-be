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

  async addPoints(data: Partial<Loyalty>): Promise<Loyalty> {
    const record = this.loyaltyRepo.create(data);
    await this.em.persistAndFlush(record);
    return record;
  }

  async getUserProductPoints(
    userId: number,
    productId: number,
  ): Promise<number> {
    const entries = await this.loyaltyRepo.find({
      user: userId,
      product: productId,
    });

    return entries.reduce((sum, entry) => sum + entry.points, 0);
  }
}
