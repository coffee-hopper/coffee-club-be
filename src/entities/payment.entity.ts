import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';

import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => Order)
  order!: Order;

  @Property()
  iyzicoTransactionId!: string;

  @Property()
  amount!: number;

  @Property()
  paymentMethod!: string; // ex: 'iyzico', 'cash'

  @Property()
  status!: string; // ex: 'success', 'failed'

  @Property({ onCreate: () => new Date() })
  paidAt: Date = new Date();
}
