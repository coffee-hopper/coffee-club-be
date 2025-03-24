import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';

import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Loyalty {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Product)
  product!: Product;

  @Property()
  points: number = 1;

  @Property({ onCreate: () => new Date() })
  earnedAt: Date = new Date();

  @Property({ nullable: true })
  note?: string;
}
