import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { LoyaltyService } from './loyalty.service';
import { Loyalty } from '../entities/loyalty.entity';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get()
  getAll(): Promise<Loyalty[]> {
    return this.loyaltyService.findAll();
  }

  @Post()
  add(@Body() data: Partial<Loyalty>): Promise<Loyalty> {
    return this.loyaltyService.addEntry(data);
  }

  @Get('user/:userId/stars')
  getUserStars(@Param('userId') userId: string) {
    return this.loyaltyService.getUserStars(Number(userId));
  }
}
