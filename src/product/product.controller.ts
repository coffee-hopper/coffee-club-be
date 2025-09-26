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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';
import {
  toBooleanOrUndefined,
  toCategoryOrUndefined,
  toOrderOrDefault,
  toSortOrDefault,
} from './product.query-helpers';

import { AdminOnlyGuard } from 'src/auth/guards/admin-only.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('category') rawCategory?: string,
    @Query('inStock') rawInStock?: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('sort') rawSort?: string,
    @Query('order') rawOrder?: string,
  ): Promise<Product[]> {
    const category = toCategoryOrUndefined(rawCategory);
    const inStock = toBooleanOrUndefined(rawInStock);
    const sort = toSortOrDefault(rawSort);
    const order = toOrderOrDefault(rawOrder);

    return this.productService.list({
      q,
      category,
      inStock,
      offset,
      limit,
      sort,
      order,
    });
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
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
