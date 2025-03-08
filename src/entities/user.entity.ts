import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  googleId?: string;

  @Property({ nullable: true })
  googleEmail?: string;

  @Property({ default: 'user' })
  role!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
