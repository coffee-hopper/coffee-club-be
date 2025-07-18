import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderResponseDto } from './dto/order.dto';

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

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.findAll({
      populate: ['user', 'items', 'items.product', 'payment'],
    });
    return orders.map((order) => new OrderResponseDto(order));
  }

  async create(data: Partial<Order>): Promise<OrderResponseDto> {
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
    return new OrderResponseDto(order);
  }

  async cancelOrder(id: number): Promise<{ message: string }> {
    const order = await this.orderRepo.findOne({ id });

    if (!order) {
      throw new BadRequestException(`Order with ID ${id} not found.`);
    }

    order.status = 'cancelled';
    await this.em.persistAndFlush(order);

    return { message: `Order ${id} has been cancelled.` };
  }
}
