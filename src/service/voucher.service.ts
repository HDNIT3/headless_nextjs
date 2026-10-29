import { cache } from 'react';
import { fetchGraphQL } from '@/lib/wordpress/graphql-client';
import { GET_COUPONS_QUERY } from '@/lib/wordpress/queries/coupons.graphql';
import type {
  Voucher,
  VoucherCategoryType,
  VoucherDiscountType,
  GetCouponsResponse,
  WooCouponNode,
} from '@/types/voucher';
import { REVALIDATE_TIME } from '@/lib/constants/cache';
import { formatVnd, formatDateVi, getRemainingDays } from '@/lib/utils/format';

export { formatVnd, formatDateVi, getRemainingDays };

export function mapWooCouponToVoucher(node: WooCouponNode): Voucher {
  const safeNode = node || ({} as Partial<WooCouponNode>);
  const isPercent = safeNode.discountType === 'PERCENT';
  const isShipping = Boolean(safeNode.freeShipping);
  const amount = Number(safeNode.amount) || 0;
  const minSpend = Number(safeNode.minimumAmount) || 0;
  const maxSpend = safeNode.maximumAmount ? Number(safeNode.maximumAmount) : undefined;

  let discountType: VoucherDiscountType = 'fixed';
  if (isShipping) {
    discountType = 'shipping';
  } else if (isPercent) {
    discountType = 'percentage';
  }

  let title = safeNode.description?.trim() || '';
  if (!title) {
    if (isShipping) {
      title = `Miễn phí vận chuyển${minSpend > 0 ? ` đơn từ ${formatVnd(minSpend)}` : ''}`;
    } else if (isPercent) {
      title = `Giảm giá ${amount}% cho đơn hàng`;
    } else {
      title = `Giảm ngay ${formatVnd(amount)} cho đơn hàng`;
    }
  }

  let featuredBadge = 'Ưu Đãi';
  if (isShipping) {
    featuredBadge = 'Freeship';
  } else if (isPercent) {
    featuredBadge = `Giảm ${amount}%`;
  } else if (amount >= 500000) {
    featuredBadge = 'Khách Sỉ';
  } else {
    featuredBadge = 'Giảm Tiền';
  }

  let category: VoucherCategoryType = 'all';
  if (isShipping) {
    category = 'shipping';
  } else if (isPercent) {
    category = 'percentage';
  } else if (minSpend >= 2000000 || amount >= 300000) {
    category = 'bulk_order';
  } else {
    category = 'new_customer';
  }

  const terms: string[] = [];
  if (minSpend > 0) {
    terms.push(`Áp dụng cho đơn hàng có giá trị tối thiểu từ ${formatVnd(minSpend)}`);
  }
  if (maxSpend && maxSpend > 0) {
    terms.push(`Mức giảm tối đa không vượt quá ${formatVnd(maxSpend)}`);
  }
  if (safeNode.individualUse) {
    terms.push('Không áp dụng đồng thời với các mã giảm giá khác');
  }
  if (safeNode.usageLimit && safeNode.usageLimit > 0) {
    terms.push(`Giới hạn tổng cộng ${safeNode.usageLimit} lượt sử dụng trên hệ thống`);
  }
  const applicableCategories =
    safeNode.productCategories?.nodes?.map((c) => c.name || '').filter(Boolean) || [];
  if (applicableCategories.length > 0) {
    terms.push(`Áp dụng riêng cho các danh mục: ${applicableCategories.join(', ')}`);
  }
  if (terms.length === 0) {
    terms.push('Áp dụng cho mọi sản phẩm đủ điều kiện trên website Bao Bì Đức Trọng');
  }

  const fallbackCode = `UUDAI${safeNode.databaseId || 'HOT'}`;
  const couponCode = (safeNode.code?.trim() || fallbackCode).toUpperCase();

  return {
    id: safeNode.id || `coupon-${safeNode.databaseId || couponCode}`,
    code: couponCode,
    title,
    description:
      safeNode.description ||
      `Mã ưu đãi ${couponCode} chính thức từ hệ thống bán lẻ & sỉ Bao Bì Đức Trọng.`,
    discountType,
    discountValue: amount,
    minOrderValue: minSpend,
    maxDiscountAmount: maxSpend,
    endDate: safeNode.dateExpiry || undefined,
    category,
    usageLimit: safeNode.usageLimit || undefined,
    usedCount: safeNode.usageCount || 0,
    terms,
    featuredBadge,
    applicableCategories:
      applicableCategories.length > 0 ? applicableCategories : ['Tất cả sản phẩm'],
    individualUse: Boolean(safeNode.individualUse),
  };
}

export const getVouchers = cache(
  async (category?: VoucherCategoryType): Promise<Voucher[]> => {
    const data = await fetchGraphQL<GetCouponsResponse>(
      GET_COUPONS_QUERY,
      { first: 50 },
      { revalidate: REVALIDATE_TIME.COUPONS, tags: ['coupons'] }
    );

    const rawNodes = data?.coupons?.nodes || [];
    const validNodes = rawNodes.filter(
      (node): node is WooCouponNode => Boolean(node && typeof node === 'object')
    );
    const vouchers = validNodes.map(mapWooCouponToVoucher);

    if (!category || category === 'all') {
      return vouchers;
    }

    return vouchers.filter((item) => item.category === category);
  }
);

export const getVoucherByCode = cache(
  async (code: string): Promise<Voucher | null> => {
    const all = await getVouchers();
    return (
      all.find((v) => v.code.toLowerCase() === code.trim().toLowerCase()) || null
    );
  }
);
