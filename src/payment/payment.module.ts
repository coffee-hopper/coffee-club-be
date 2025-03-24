import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { Payment } from '../entities/payment.entity';
import { Order } from 'src/entities/order.entity';
import { Loyalty } from 'src/entities/loyalty.entity';
import { Invoice } from 'src/entities/invoice.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Payment, Order, Loyalty, Invoice])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
