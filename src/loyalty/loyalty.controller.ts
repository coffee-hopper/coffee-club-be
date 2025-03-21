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
    return this.loyaltyService.addPoints(data);
  }

  //WILL BE EDITED
  // @Get('user/:id')
  // getUserPoints(@Param('id') userId: string): Promise<number> {
  //   return this.loyaltyService.getUserPoints(Number(userId));
  // }

  @Get('user/:userId/product/:productId')
  getUserProductPoints(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<number> {
    return this.loyaltyService.getUserProductPoints(
      Number(userId),
      Number(productId),
    );
  }
}
