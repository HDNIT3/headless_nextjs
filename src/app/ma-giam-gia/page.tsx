import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import {
  VoucherPageContent,
  VoucherListSkeleton,
} from '@/components/features/voucher';
import { getVouchers } from '@/service/voucher.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Mã Giảm Giá & Ưu Đãi Độc Quyền | Bao Bì Đức Trọng',
  description:
    'Tổng hợp mã giảm giá, voucher khuyến mãi, mã miễn phí vận chuyển cho các sản phẩm thùng xốp, bao bì đóng gói nông sản tại Bao Bì Đức Trọng.',
  keywords: [
    'mã giảm giá',
    'voucher',
    'khuyến mãi bao bì',
    'thùng xốp giá rẻ',
    'ưu đãi bao bì đức trọng',
    'freeship thùng xốp',
  ],
  openGraph: {
    title: 'Mã Giảm Giá & Ưu Đãi Độc Quyền | Bao Bì Đức Trọng',
    description:
      'Lưu ngay mã voucher ưu đãi đến 15% và miễn phí vận chuyển cho đơn hàng bao bì, thùng xốp nông sản.',
    type: 'website',
  },
};

export default async function MaGiamGiaPage() {
  const vouchers = await getVouchers();

  return (
    <PageTransition>
      <Suspense fallback={<VoucherListSkeleton />}>
        <VoucherPageContent initialVouchers={vouchers} />
      </Suspense>
    </PageTransition>
  );
}
