import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Loyalty } from '../entities/loyalty.entity';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Loyalty])],
  providers: [LoyaltyService],
  controllers: [LoyaltyController],
})
export class LoyaltyModule {}
