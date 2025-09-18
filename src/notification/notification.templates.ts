export type TemplateContext = Record<string, any>;

export enum NotificationCode {
  // REWARD
  REWARD_FREE_DRINK = 'REWARD_FREE_DRINK',

  // ORDER
  ORDER_PURCHASED = 'ORDER_PURCHASED',

  // SYSTEM
  SYSTEM_WELCOME = 'SYSTEM_WELCOME',
  SYSTEM_ROLE_PROMOTED = 'SYSTEM_ROLE_PROMOTED',
  SYSTEM_LOW_STOCK = 'SYSTEM_LOW_STOCK',
}

export type NotificationCategory = 'reward' | 'order' | 'system';

type TemplateShape = {
  type: NotificationCategory;
  title: (ctx: TemplateContext) => string;
  body?: (ctx: TemplateContext) => string | undefined;
  defaultMetadata?: TemplateContext;
};

export const TEMPLATES: Record<NotificationCode, TemplateShape> = {
  [NotificationCode.REWARD_FREE_DRINK]: {
    type: 'reward',
    title: () => 'You earned a free drink!',
    body: () => 'Enjoy 1 Tall-sized drink on us.',
    defaultMetadata: { route: 'rewards' },
  },

  [NotificationCode.ORDER_PURCHASED]: {
    type: 'order',
    title: () => 'Purchase confirmed — enjoy!',
    body: (ctx) => `You spent ${ctx.total} TL and earned ${ctx.count} stars.`,
    defaultMetadata: { route: 'orderDetail' },
  },

  [NotificationCode.SYSTEM_WELCOME]: {
    type: 'system',
    title: () => 'Welcome, Coffee Hopper!',
    body: () =>
      'You’ve joined our loyalty system. Keep purchasing to earn stars and claim a free drink.',
    defaultMetadata: { route: 'rewards' },
  },

  [NotificationCode.SYSTEM_ROLE_PROMOTED]: {
    type: 'system',
    title: () => 'Your role has been updated',
    body: () =>
      'You’re now an admin. You can view and edit product or user details.',
    defaultMetadata: { route: 'adminDashboard' },
  },

  [NotificationCode.SYSTEM_LOW_STOCK]: {
    type: 'system',
    title: (ctx) => `Low stock: ${ctx.productName}`,
    body: (ctx) => `${ctx.remaining} left. Please restock.`,
    defaultMetadata: { route: 'productDetail' },
  },
};

export function renderTemplate(
  code: NotificationCode,
  ctx: TemplateContext = {},
): {
  type: NotificationCategory;
  title: string;
  body?: string;
  metadata?: TemplateContext;
} {
  const tpl = TEMPLATES[code];
  const title = tpl.title(ctx);
  const body = tpl.body ? tpl.body(ctx) : undefined;
  const metadata = { ...(tpl.defaultMetadata ?? {}), ...ctx };
  return { type: tpl.type, title, body, metadata };
}

export type PurchaseCtx = {
  total: number;
  count: number;
  orderId?: number;
  username?: string;
};
export type LowStockCtx = {
  productName: string;
  remaining: number;
  threshold?: number;
};
