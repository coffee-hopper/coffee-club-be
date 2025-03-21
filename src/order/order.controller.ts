import { Controller, Get, Post, Body } from '@nestjs/common';

import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Order>): Promise<Order> {
    return this.orderService.create(data);
  }
}
