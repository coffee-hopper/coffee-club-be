import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  OneToOne,
} from '@mikro-orm/core';

import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items = new Array<OrderItem>();

  @OneToOne(() => Payment, (payment) => payment.order, { nullable: true })
  payment?: Payment;

  @Property()
  totalAmount!: number;

  @Property({ default: 'pending' })
  status!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
