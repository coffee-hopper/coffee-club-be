import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';

import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => Product)
  product!: Product;

  @Property()
  quantity!: number;

  @Property()
  price!: number;
}
