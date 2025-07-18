export const PRODUCT_CATEGORIES = ['coffee', 'tea', 'food'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
