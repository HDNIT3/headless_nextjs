import { PageInfo } from './common';

export interface ProductAttributeNode {
  name: string;
  options: string[];
}

export interface ProductNode {
  id: string;
  databaseId?: number;
  name: string;
  slug: string;
  image?: {
    sourceUrl: string;
    altText?: string | null;
  } | null;
  thongtinsanpham?: {
    luotmua?: number | null;
  } | null;
  productCategories?: {
    nodes: { name: string; slug?: string }[];
  } | null;
  attributes?: {
    nodes: ProductAttributeNode[];
  } | null;
}

export interface ProductGalleryImage {
  id: string;
  sourceUrl: string;
  altText?: string | null;
}

export interface ProductDetailThongTinSanPham {
  luTXem?: number | null;
  luotmua?: number | null;
  chatlieu?: string | null;
  doday?: string | null;
  taitrong?: string | null;
  congdung?: string | null;
  ungdungchitiet?: string | null;
  visaonensudung?: string | null;
}

export interface ProductDetailNode extends ProductNode {
  galleryImages?: {
    nodes: ProductGalleryImage[];
  } | null;
  productCategories?: {
    nodes: { id: string; name: string; slug: string }[];
  } | null;
  thongtinsanpham?: ProductDetailThongTinSanPham | null;
}

export interface GetProductDetailResponse {
  product: ProductDetailNode | null;
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
