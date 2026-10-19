import { fetchGraphQL } from "@/lib/wordpress/graphql-client";
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_ATTR_KICH_THUOCS_QUERY,
  GET_PRODUCT_ATTR_MAU_SACS_QUERY,
} from "@/lib/wordpress/queries/products.graphql";
import {
  GetProductsResponse,
  GetProductsVariables,
  GetProductAttrKichThuocsResponse,
  GetProductAttrMauSacsResponse,
  AttributeNode,
  ProductsConnection,
} from "@/types/product";

export async function getProducts(
  variables: GetProductsVariables = { first: 12 }
): Promise<GetProductsResponse> {
  const data = await fetchGraphQL<GetProductsResponse>(
    GET_PRODUCTS_QUERY,
    variables,
    { revalidate: 60, tags: ['products'] }
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

export async function getProductAttrKichThuocs(): Promise<AttributeNode[]> {
  const data = await fetchGraphQL<GetProductAttrKichThuocsResponse>(
    GET_PRODUCT_ATTR_KICH_THUOCS_QUERY,
    {},
    { revalidate: 120, tags: ['product-attr-kich-thuocs'] }
  );

  return data?.productAttrKichThuocs?.nodes || [];
}

export async function getProductAttrMauSacs(): Promise<AttributeNode[]> {
  const data = await fetchGraphQL<GetProductAttrMauSacsResponse>(
    GET_PRODUCT_ATTR_MAU_SACS_QUERY,
    {},
    { revalidate: 120, tags: ['product-attr-mau-sacs'] }
  );

  return data?.productAttrMauSacs?.nodes || [];
}
