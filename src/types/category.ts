export interface ProductCategoryNode {
  id: string;
  databaseId?: number;
  name: string;
  slug: string;
  count?: number;
  parentId?: string | null;
}

export interface GetProductCategoriesResponse {
  productCategories: {
    nodes: ProductCategoryNode[];
  };
}
