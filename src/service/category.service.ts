import { fetchGraphQL } from "@/lib/wordpress/graphql-client";
import { GET_PRODUCT_CATEGORIES_QUERY } from "@/lib/wordpress/queries/categories.graphql";
import { GetProductCategoriesResponse, ProductCategoryNode } from "@/types/category";

export async function getProductCategories(): Promise<ProductCategoryNode[]> {
  const data = await fetchGraphQL<GetProductCategoriesResponse>(
    GET_PRODUCT_CATEGORIES_QUERY,
    {},
    { revalidate: 60, tags: ['product-categories'] }
  );

  return data?.productCategories?.nodes || [];
}
