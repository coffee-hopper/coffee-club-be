import { Controller, Get, Post, Body } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { Payment } from '../entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Payment>): Promise<Payment> {
    return this.paymentService.create(data);
  }
}
