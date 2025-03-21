import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: EntityRepository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: EntityRepository<OrderItem>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepo.findAll({ populate: ['user', 'items'] });
  }

  async create(data: Partial<Order>): Promise<Order> {
    for (const item of data.items ?? []) {
      if (!item.product || !item.product.id) {
        throw new BadRequestException('Product ID is required for each item');
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new BadRequestException('Quantity must be a positive number');
      }

      const product = await this.productRepo.findOne({ id: item.product.id });

      if (!product) {
        throw new BadRequestException(
          `Product ID ${item.product.id} not found`,
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${product.name} — available: ${product.stockQuantity}`,
        );
      }

      product.stockQuantity -= item.quantity;
      await this.em.persist(product);
    }

    const order = this.orderRepo.create(data);
    await this.em.persistAndFlush(order);
    return order;
  }
}
