import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  category: 'drink' | 'food' | 'snack' | 'accessory' = 'drink';

  @Property({ nullable: true })
  description?: string;

  @Property()
  price!: number;

  @Property()
  stockQuantity!: number;

  @Property({ default: 1 })
  loyaltyMultiplier!: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
