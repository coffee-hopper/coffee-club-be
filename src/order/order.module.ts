import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Order, OrderItem, Product]),
    NotificationModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
