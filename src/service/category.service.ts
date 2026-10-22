import { cache } from 'react';
import { fetchGraphQL } from '@/lib/wordpress/graphql-client';
import { GET_PRODUCT_CATEGORIES_QUERY } from '@/lib/wordpress/queries/categories.graphql';
import { GetProductCategoriesResponse, ProductCategoryNode } from '@/types/category';

/**
 * Categories are requested by both the header and the product sidebar. `cache`
 * de-duplicates those calls within a single server render.
 */
export const getProductCategories = cache(
  async (): Promise<ProductCategoryNode[]> => {
    const data = await fetchGraphQL<GetProductCategoriesResponse>(
      GET_PRODUCT_CATEGORIES_QUERY,
      {},
      { revalidate: 60, tags: ['product-categories'] }
    );

    return data?.productCategories?.nodes || [];
  }
);
