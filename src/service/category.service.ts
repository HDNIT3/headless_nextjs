import { cache } from 'react';
import { fetchGraphQL } from '@/lib/wordpress/graphql-client';
import { GET_PRODUCT_CATEGORIES_QUERY } from '@/lib/wordpress/queries/categories.graphql';
import { GetProductCategoriesResponse, ProductCategoryNode } from '@/types/category';
import { REVALIDATE_TIME } from '@/lib/constants/cache';

export const getProductCategories = cache(
  async (): Promise<ProductCategoryNode[]> => {
    const data = await fetchGraphQL<GetProductCategoriesResponse>(
      GET_PRODUCT_CATEGORIES_QUERY,
      {},
      { revalidate: false }
    );

    return data?.productCategories?.nodes || [];
  }
);
