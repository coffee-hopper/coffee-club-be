import {
  PRODUCT_CATEGORIES,
  ProductCategory,
} from 'src/constants/product-category';
import { SORT_FIELDS, ORDER_DIRECTIONS } from './product.constants';
import type { SortField, OrderDirection } from './product.types';

export function toBooleanOrUndefined(v?: string): boolean | undefined {
  if (v === undefined) return undefined;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

export function toCategoryOrUndefined(v?: string): ProductCategory | undefined {
  if (!v) return undefined;
  return PRODUCT_CATEGORIES.includes(v as ProductCategory)
    ? (v as ProductCategory)
    : undefined;
}

export function toSortOrDefault(v?: string): SortField {
  return (SORT_FIELDS as readonly string[]).includes(v || '')
    ? (v as SortField)
    : 'name';
}

export function toOrderOrDefault(v?: string): OrderDirection {
  return (ORDER_DIRECTIONS as readonly string[]).includes(v || '')
    ? (v as OrderDirection)
    : 'asc';
}
