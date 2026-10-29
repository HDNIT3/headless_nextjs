'use server';

import { getProductCategories } from '@/service/category.service';
import {
  getProductAttrKichThuocs,
  getProductAttrMauSacs,
  getProducts,
} from '@/service/product.service';
import { getVouchers } from '@/service/voucher.service';
import { getNewsList } from '@/service/post.service';
import type { ProductCategoryNode } from '@/types/category';
import type {
  AttributeNode,
  GetProductsResponse,
  GetProductsVariables,
} from '@/types/product';
import type { Voucher, VoucherCategoryType } from '@/types/voucher';
import type { GetNewsListResponse, GetNewsListVariables } from '@/types/post';

export interface ProductSidebarDataResult {
  categories: ProductCategoryNode[];
  kichThuocs: AttributeNode[];
  mauSacs: AttributeNode[];
}

/**
 * Server Action tải dữ liệu Sidebar lọc sản phẩm khi người dùng cuộn tới
 */
export async function fetchProductSidebarDataAction(): Promise<ProductSidebarDataResult> {
  try {
    const [categories, kichThuocs, mauSacs] = await Promise.all([
      getProductCategories(),
      getProductAttrKichThuocs(),
      getProductAttrMauSacs(),
    ]);

    return {
      categories,
      kichThuocs,
      mauSacs,
    };
  } catch (error) {
    console.error('Lỗi khi fetch ProductSidebarDataAction:', error);
    return {
      categories: [],
      kichThuocs: [],
      mauSacs: [],
    };
  }
}

/**
 * Server Action tải danh sách sản phẩm khi cần lazy fetch hoặc infinite scroll
 */
export async function fetchProductsAction(
  variables: GetProductsVariables = { first: 12 }
): Promise<GetProductsResponse> {
  try {
    return await getProducts(variables);
  } catch (error) {
    console.error('Lỗi khi fetch ProductsAction:', error);
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
}

/**
 * Server Action tải danh sách voucher theo danh mục khi cuộn tới
 */
export async function fetchVouchersAction(
  category?: VoucherCategoryType
): Promise<Voucher[]> {
  try {
    return await getVouchers(category);
  } catch (error) {
    console.error('Lỗi khi fetch VouchersAction:', error);
    return [];
  }
}

/**
 * Server Action tải danh sách tin tức khi cuộn tới
 */
export async function fetchNewsAction(
  variables: GetNewsListVariables = { first: 10 }
): Promise<GetNewsListResponse> {
  try {
    return await getNewsList(variables);
  } catch (error) {
    console.error('Lỗi khi fetch NewsAction:', error);
    return {
      posts: {
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
        nodes: [],
      },
    };
  }
}

