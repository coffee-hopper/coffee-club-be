import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';

import {
  NotificationCode,
  renderTemplate,
  PurchaseCtx,
  LowStockCtx,
} from './notification.templates';

type ListOptions = {
  afterId?: number;
  limit?: number;
  unread?: boolean;
};

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: EntityRepository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
  ) {}

  private get em() {
    return this.notificationRepo.getEntityManager();
  }

  async sendToUserFromCode(
    user: User,
    code: NotificationCode,
    ctx: Record<string, any> = {},
    dedupeKey?: string | null,
  ): Promise<Notification> {
    const tpl = renderTemplate(code, ctx);

    const notif = this.notificationRepo.create({
      user,
      type: tpl.type as Notification['type'],
      title: tpl.title,
      body: tpl.body,
      metadata: tpl.metadata ?? {},
      dedupeKey: dedupeKey ?? null,
      code,
    });

    await this.em.persistAndFlush(notif);
    return notif;
  }

  async sendToAdminsFromCode(
    code: NotificationCode,
    ctx: Record<string, any> = {},
    dedupeKey?: string | null,
  ): Promise<number> {
    const admins = await this.userRepo.find({ role: 'admin' });
    if (admins.length === 0) return 0;

    const tpl = renderTemplate(code, ctx);
    const batch = admins.map((admin) =>
      this.notificationRepo.create({
        user: admin,
        type: tpl.type as Notification['type'],
        title: tpl.title,
        body: tpl.body,
        metadata: tpl.metadata ?? {},
        dedupeKey: dedupeKey ?? null,
        code,
      }),
    );

    await this.em.persistAndFlush(batch);
    return batch.length;
  }

  async notifyPurchaseComplete(user: User, ctx: PurchaseCtx): Promise<void> {
    await this.sendToUserFromCode(user, NotificationCode.ORDER_PURCHASED, ctx);
  }

  async checkLowStockAfterOrder(
    productIds: number[],
    defaultThreshold = 10,
  ): Promise<void> {
    if (!productIds?.length) return;

    const products = await this.productRepo.find({ id: { $in: productIds } });

    for (const p of products) {
      const threshold = (p as any).lowStockThreshold ?? defaultThreshold;
      if (p.stockQuantity <= threshold) {
        const ctx: LowStockCtx = {
          productName: p.name,
          remaining: p.stockQuantity,
          threshold,
        };

        await this.sendToAdminsFromCode(
          NotificationCode.SYSTEM_LOW_STOCK,
          ctx,
          `low-stock:${p.id}:${p.stockQuantity}`,
        );
      }
    }
  }

  async listForUser(
    userId: number,
    opts: ListOptions = {},
  ): Promise<{ items: Notification[]; nextAfterId?: number }> {
    const where: Record<string, any> = { user: userId };

    if (opts.unread === true) where.readAt = null;
    else if (opts.unread === false) where.readAt = { $ne: null };

    if (opts.afterId !== undefined) where.id = { $gt: opts.afterId };

    const limit = Math.max(1, Math.min(opts.limit ?? 50, 200));
    const items = await this.notificationRepo.find(where, {
      orderBy: { id: 'desc' },
      limit,
    });

    const nextAfterId = items.length > 0 ? items[0].id : undefined;
    return { items, nextAfterId };
  }

  async unreadCount(userId: number): Promise<{ count: number }> {
    const count = await this.notificationRepo.count({
      user: userId,
      readAt: null,
    });
    return { count };
  }

  async markRead(userId: number, ids: number[]): Promise<{ updated: number }> {
    if (!ids.length) return { updated: 0 };
    const updated = await this.em.nativeUpdate(
      Notification,
      { user: userId, id: { $in: ids } },
      { isRead: true, readAt: new Date() },
    );
    return { updated: updated as unknown as number };
  }

  async markUnread(
    userId: number,
    ids: number[],
  ): Promise<{ updated: number }> {
    if (!ids.length) return { updated: 0 };
    const updated = await this.em.nativeUpdate(
      Notification,
      { user: userId, id: { $in: ids } },
      { isRead: false, readAt: null },
    );
    return { updated: updated as unknown as number };
  }

  async deleteForUser(
    userId: number,
    ids: number[],
  ): Promise<{ deleted: number }> {
    if (!ids.length) return { deleted: 0 };
    const deleted = await this.em.nativeDelete(Notification, {
      user: userId,
      id: { $in: ids },
    });
    return { deleted: deleted as unknown as number };
  }

  async listUserNotifications(
    userId: number,
    limit = 50,
  ): Promise<Notification[]> {
    return this.notificationRepo.find(
      { user: userId },
      { orderBy: { createdAt: 'desc' }, limit },
    );
  }
}
