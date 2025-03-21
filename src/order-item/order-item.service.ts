import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';

import { OrderItem } from '../entities/order-item.entity';

/**
 * DO NOT use this service directly for creating order items.
 * OrderItem creation must be handled inside OrderService.create()
 * to ensure product stock logic, pricing, and order linking is preserved.
 */

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: EntityRepository<OrderItem>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepo.findAll({ populate: ['order', 'product'] });
  }

  async create(): Promise<OrderItem> {
    throw new Error(
      '❌ OrderItems should only be created via OrderService.create()',
    );
  }
}
