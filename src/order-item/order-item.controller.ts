import { Controller, Get } from '@nestjs/common';

import { OrderItemService } from './order-item.service';
import { OrderItem } from '../entities/order-item.entity';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  getAll(): Promise<OrderItem[]> {
    return this.orderItemService.findAll();
  }

  // 🚫 POST removed intentionally — see service note for why
}
