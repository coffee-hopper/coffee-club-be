import { ProductCategory } from 'src/constants/product-category';

export type SortField = 'name' | 'price' | 'createdAt';
export type OrderDirection = 'asc' | 'desc';

export interface ProductListOpts {
  q?: string;
  category?: ProductCategory;
  inStock?: boolean;
  offset?: number;
  limit?: number;
  sort?: SortField;
  order?: OrderDirection;
}
