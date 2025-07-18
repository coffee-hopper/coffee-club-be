import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';

import { AdminOnlyGuard } from 'src/auth/guards/admin-only.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(@Query('category') category?: string): Promise<Product[]> {
    return this.productService.findAll(category);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
  create(@Body() data: Partial<Product>): Promise<Product> {
    return this.productService.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
  update(@Param('id') id: string, @Body() data: Partial<Product>) {
    return this.productService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
  delete(@Param('id') id: string) {
    return this.productService.delete(Number(id));
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
  deleteAll() {
    return this.productService.deleteAll();
  }
}
