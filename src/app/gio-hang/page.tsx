import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import { CartPageContent } from '@/components/features/cart/cart-page-content';
import { getVouchers } from '@/service/voucher.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Giỏ Hàng | Bao Bì Đức Trọng',
  description:
    'Xem và quản lý các sản phẩm bao bì nông sản, áp dụng mã voucher ưu đãi và tiến hành đặt hàng.',
};

export default async function CartPage() {
  const vouchers = await getVouchers();

  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-[calc(100vh-80px)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[1360px] px-4 py-16 text-center text-gray-400">
              Đang tải giỏ hàng...
            </div>
          }
        >
          <CartPageContent availableVouchers={vouchers} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
