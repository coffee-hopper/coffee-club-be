import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

import { Payment } from '../entities/payment.entity';
import { Order } from '../entities/order.entity';
import { Loyalty } from '../entities/loyalty.entity';
import { Invoice } from '../entities/invoice.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: EntityRepository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: EntityRepository<Order>,
    @InjectRepository(Loyalty)
    private readonly loyaltyRepo: EntityRepository<Loyalty>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.findAll({ populate: ['order'] });
  }

  async create(data: Partial<Payment>): Promise<any> {
    const payment = this.paymentRepo.create(data);
    await this.em.persistAndFlush(payment);

    const rewardMessages: string[] = [];

    if (payment.status === 'success') {
      const order = await this.orderRepo.findOne(
        { id: payment.order.id },
        { populate: ['user'] },
      );
      if (!order) throw new BadRequestException('Order not found');

      const orderItems = await this.em.find(
        OrderItem,
        { order: order.id },
        { populate: ['product'] },
      );

      // Loyalty: 1 star per drink item
      for (const item of orderItems) {
        if (item.product.category === 'drink') {
          const loyalty = this.loyaltyRepo.create({
            user: order.user,
            product: item.product,
            points: item.quantity,
            note: `Earned from payment ${payment.id}`,
          });
          await this.em.persist(loyalty);
        }
      }

      // Fetch total stars after applying all new ones
      const allStars = await this.loyaltyRepo.find({ user: order.user });
      const starCount = allStars.reduce((sum, e) => sum + e.points, 0);

      if (starCount % 15 === 0) {
        rewardMessages.push('🎉 You earned a free tall-size coffee!');
      } else if (starCount % 15 === 14) {
        rewardMessages.push('🧃 You’re 1 star away from a free drink!');
      }

      // Invoice
      const invoice = this.em.create(Invoice, {
        order,
        billingAddress: `User ${order.user.id}`,
        totalAmount: payment.amount,
      });

      await this.em.persist(invoice);
      await this.em.flush();
    }

    return {
      payment,
      messages: rewardMessages,
    };
  }
}
