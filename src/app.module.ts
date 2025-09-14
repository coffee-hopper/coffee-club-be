import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from 'src/mikro-orm.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OTPModule } from './otp/otp.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    UsersModule,
    AuthModule,
    OTPModule,
    InvoiceModule,
    LoyaltyModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    ProductModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
