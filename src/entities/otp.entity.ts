import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class OTP {
  @PrimaryKey()
  id!: number;

  @Property()
  phone!: string;

  @Property()
  expiresAt!: Date;

  @Property()
  isUsed: boolean = false;

  @Property()
  createdAt: Date = new Date();
}
