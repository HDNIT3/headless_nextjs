import { cache } from "react";
import { fetchGraphQL } from "@/lib/wordpress/graphql-client";
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_DETAIL_QUERY,
  GET_PRODUCT_ATTR_KICH_THUOCS_QUERY,
  GET_PRODUCT_ATTR_MAU_SACS_QUERY,
} from "@/lib/wordpress/queries/products.graphql";
import {
  GetProductsResponse,
  GetProductsVariables,
  GetProductDetailResponse,
  ProductDetailNode,
  GetProductAttrKichThuocsResponse,
  GetProductAttrMauSacsResponse,
  AttributeNode,
} from "@/types/product";
import { REVALIDATE_TIME } from "@/lib/constants/cache";

export async function getProducts(
  variables: GetProductsVariables = { first: 12 }
): Promise<GetProductsResponse> {
  const data = await fetchGraphQL<GetProductsResponse>(
    GET_PRODUCTS_QUERY,
    variables,
    { revalidate: false }
  );

  if (data?.products?.nodes?.length) {
    return data;
  }

  return {
    products: {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: null,
        startCursor: null,
      },
      nodes: [],
    },
  };
}

export const getProductDetail = cache(
  async (slug: string): Promise<ProductDetailNode | null> => {
    const data = await fetchGraphQL<GetProductDetailResponse>(
      GET_PRODUCT_DETAIL_QUERY,
      { slug },
      { revalidate: false }
    );

    return data?.product ?? null;
  }
);

export async function getProductAttrKichThuocs(): Promise<AttributeNode[]> {
  const data = await fetchGraphQL<GetProductAttrKichThuocsResponse>(
    GET_PRODUCT_ATTR_KICH_THUOCS_QUERY,
    {},
    { revalidate: false }
  );

  return data?.productAttrKichThuocs?.nodes || [];
}

export async function getProductAttrMauSacs(): Promise<AttributeNode[]> {
  const data = await fetchGraphQL<GetProductAttrMauSacsResponse>(
    GET_PRODUCT_ATTR_MAU_SACS_QUERY,
    {},
    { revalidate: false }
  );

  return data?.productAttrMauSacs?.nodes || [];
}
