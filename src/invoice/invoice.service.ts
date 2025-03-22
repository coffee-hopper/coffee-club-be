import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Invoice } from '../entities/invoice.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: EntityRepository<Invoice>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepo.findAll({ populate: ['order'] });
  }

  async create(data: Partial<Invoice>): Promise<Invoice> {
    const invoice = this.invoiceRepo.create(data);
    await this.em.persistAndFlush(invoice);
    return invoice;
  }

  async findByOrderId(orderId: number): Promise<Invoice | null> {
    return this.invoiceRepo.findOne(
      { order: orderId },
      { populate: ['order'] },
    );
  }
}
