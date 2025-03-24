import { Controller, Get, Post, Param, Body } from '@nestjs/common';

import { InvoiceService } from './invoice.service';
import { Invoice } from '../entities/invoice.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  getAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Invoice>): Promise<Invoice> {
    return this.invoiceService.create(data);
  }

  @Get('order/:id')
  getByOrderId(@Param('id') orderId: string): Promise<Invoice | null> {
    return this.invoiceService.findByOrderId(Number(orderId));
  }
}
