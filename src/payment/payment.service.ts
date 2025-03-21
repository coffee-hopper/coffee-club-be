import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

import { Payment } from '../entities/payment.entity';
import { Order } from '../entities/order.entity';
import { Loyalty } from '../entities/loyalty.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { OrderItem } from 'src/entities/order-item.entity';

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

      if (!order) throw new BadRequestException('Order not found for payment');

      const orderItems = await this.em.find(
        OrderItem,
        { order: order.id },
        { populate: ['product'] },
      );

      for (const item of orderItems) {
        // adding loyalty points logic for product kind
        const loyalty = this.loyaltyRepo.create({
          user: order.user,
          product: item.product,
          points: item.quantity,
          note: `Payment ${payment.id} - ${item.product.name}`,
        });
        await this.em.persist(loyalty);

        const entries = await this.loyaltyRepo.find(
          { user: order.user, product: item.product },
          { orderBy: { earnedAt: 'asc' } },
        );

        const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);

        if (totalPoints >= 5) {
          const rewards = Math.floor(totalPoints / 5);
          const remaining = totalPoints % 5;

          rewardMessages.push(
            `🎉 You earned ${rewards} free ${item.product.name}${rewards > 1 ? 's' : ''}! Redeem next time.`,
          );

          let pointsToRemove = totalPoints - remaining;
          const toDelete: Loyalty[] = [];

          for (const entry of entries) {
            if (pointsToRemove <= 0) break;

            if (entry.points <= pointsToRemove) {
              toDelete.push(entry);
              pointsToRemove -= entry.points;
            } else {
              entry.points -= pointsToRemove;
              pointsToRemove = 0;
              await this.em.persist(entry);
            }
          }

          for (const used of toDelete) {
            this.em.removeAndFlush(used);
          }
        } else if (totalPoints === 4) {
          rewardMessages.push(
            `🧃 You're 1 ${item.product.name} away from a free one!`,
          );
        }
      }

      // invoice logic
      const invoice = this.em.create(Invoice, {
        order,
        billingAddress: `User ${order.user.id} - Default Address`,
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
