export type VoucherDiscountType = 'percentage' | 'fixed' | 'shipping';

export type VoucherCategoryType =
  | 'all'
  | 'new_customer'
  | 'shipping'
  | 'percentage'
  | 'bulk_order';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: VoucherDiscountType;
  discountValue: number; 
  maxDiscountAmount?: number; 
  minOrderValue: number; 
  startDate?: string;
  endDate?: string;
  category: VoucherCategoryType;
  usageLimit?: number;
  usedCount?: number;
  terms: string[];
  isHot?: boolean;
  featuredBadge?: string;
  applicableCategories?: string[];
  individualUse?: boolean;
}

export interface VoucherFilterOptions {
  category?: VoucherCategoryType;
  search?: string;
  sortBy?: 'newest' | 'discount_high' | 'expiring_soon';
}

export type WooDiscountTypeEnum = 'PERCENT' | 'FIXED_CART' | 'FIXED_PRODUCT';

export interface WooCouponNode {
  id: string;
  databaseId?: number;
  code: string;
  description?: string | null;
  discountType?: WooDiscountTypeEnum | string | null;
  amount?: number | null;
  dateExpiry?: string | null;
  freeShipping?: boolean | null;
  minimumAmount?: number | null;
  maximumAmount?: number | null;
  individualUse?: boolean | null;
  usageLimit?: number | null;
  usageCount?: number | null;
  productCategories?: {
    nodes?: Array<{
      name?: string;
      slug?: string;
    }>;
  };
}

export interface GetCouponsResponse {
  coupons?: {
    nodes?: WooCouponNode[];
  };
}
