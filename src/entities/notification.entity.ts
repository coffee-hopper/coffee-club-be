import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  Index,
} from '@mikro-orm/core';
import { User } from '../entities/user.entity';

export type NotificationType = 'reward' | 'order' | 'system';

@Entity({ tableName: 'notifications' })
@Index({ properties: ['user', 'createdAt'] })
@Index({ properties: ['user', 'isRead'] })
export class Notification {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  type!: NotificationType;

  @Property()
  code!: string;

  @Property()
  title!: string;

  @Property({ nullable: true })
  body?: string;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Property({ default: false })
  isRead: boolean = false;

  @Property({ nullable: true })
  readAt?: Date;

  @Property()
  createdAt: Date = new Date();

  // Prevent spamming (e.g., low stock)
  @Unique()
  @Property({ nullable: true })
  dedupeKey?: string;
}
