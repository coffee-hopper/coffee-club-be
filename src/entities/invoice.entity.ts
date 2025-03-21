import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { Order } from './order.entity';

@Entity()
export class Invoice {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => Order)
  order!: Order;

  @Property()
  billingAddress!: string;

  @Property()
  totalAmount!: number;

  @Property({ onCreate: () => new Date() })
  invoiceDate: Date = new Date();
}
