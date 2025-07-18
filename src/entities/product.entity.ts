import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ProductCategory } from '../constants/product-category';

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  imageName!: string;

  @Property()
  category: ProductCategory = 'coffee';

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
