import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationService } from './notification.service';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { NotificationController } from './notification.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Notification, User, Product])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
