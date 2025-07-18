import { Controller, Get, Post, Body, Delete } from '@nestjs/common';

import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';
import { CancelOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll(): Promise<OrderResponseDto[]> {
    return this.orderService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Order>): Promise<OrderResponseDto> {
    return this.orderService.create(data);
  }

  @Delete()
  cancel(@Body() data: CancelOrderDto): Promise<{ message: string }> {
    return this.orderService.cancelOrder(data.id);
  }
}
