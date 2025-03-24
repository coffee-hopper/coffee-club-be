import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.findAll();
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    await this.em.persistAndFlush(product);
    return product;
  }
}
