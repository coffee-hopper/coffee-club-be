import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository, EntityManager, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Product } from 'src/entities/product.entity';
import {
  PRODUCT_CATEGORIES,
  ProductCategory,
} from 'src/constants/product-category';
import type { ProductListOpts } from './product.types';

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

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
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

  async list(opts: ProductListOpts = {}) {
    const {
      q,
      category,
      inStock,
      offset = 0,
      limit = 50,
      sort = 'name',
      order = 'asc',
    } = opts;

    const where: FilterQuery<Product> = {};

    if (q && q.trim()) {
      where.name = { $ilike: `%${q.trim()}%` };
    }
    if (category) {
      where.category = category;
    }
    if (typeof inStock === 'boolean') {
      where.stockQuantity = inStock ? { $gt: 0 } : { $gte: 0 };
    }

    const [items] = await this.productRepo.findAndCount(where, {
      limit: Math.min(Math.max(limit, 1), 100),
      offset: Math.max(offset, 0),
      orderBy: { [sort]: order },
    });

    return items;
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
