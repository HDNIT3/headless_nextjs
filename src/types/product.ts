import { PageInfo } from './common';

export interface ProductNode {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    } | null;
  } | null;
  thongtinsanpham?: {
    luTMua?: number | null;
  } | null;
  productCategories?: {
    nodes: { name: string; slug?: string }[];
  } | null;
  productAttrMauSacs?: {
    nodes: { name: string }[];
  } | null;
  productAttrKichThuocs?: {
    nodes: { name: string }[];
  } | null;
}

export interface ProductsConnection {
  nodes: ProductNode[];
  pageInfo: PageInfo & {
    hasPreviousPage?: boolean;
    startCursor?: string | null;
  };
}

export interface GetProductsResponse {
  products: ProductsConnection;
}

export interface GetProductsVariables {
  first?: number;
  after?: string | null;
  search?: string;
}

export interface AttributeNode {
  name: string;
}

export interface GetProductAttrKichThuocsResponse {
  productAttrKichThuocs: {
    nodes: AttributeNode[];
  };
}

export interface GetProductAttrMauSacsResponse {
  productAttrMauSacs: {
    nodes: AttributeNode[];
  };
}
