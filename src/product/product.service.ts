import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Product } from 'src/entities/product.entity';
import {
  PRODUCT_CATEGORIES,
  ProductCategory,
} from 'src/constants/product-category';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    private readonly em: EntityManager,
  ) {}

  async findAll(category?: string): Promise<Product[]> {
    if (category && PRODUCT_CATEGORIES.includes(category as ProductCategory)) {
      return this.productRepo.find({ category: category as ProductCategory });
    }
    return this.productRepo.findAll();
  }

  async create(data: Partial<Product>): Promise<Product> {
    if (!data.imageName && data.name && data.category) {
      const formattedName = data.name.toLowerCase().replace(/\s+/g, '_');
      const formattedCategory = data.category.toLowerCase();
      data.imageName = `${formattedCategory}_${formattedName}.png`;
    }

    const product = this.productRepo.create(data);
    await this.em.persistAndFlush(product);
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepo.findOne({ id });
    if (!product) throw new Error('Product not found');

    this.productRepo.assign(product, data);
    await this.em.persistAndFlush(product);
    return product;
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.productRepo.findOne({ id });
    if (!product) throw new Error('Product not found');

    await this.em.removeAndFlush(product);
    return true;
  }

  async deleteAll(): Promise<number> {
    const products = await this.productRepo.findAll();
    await this.em.removeAndFlush(products);
    return products.length;
  }
}
