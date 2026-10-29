import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import { CheckoutPageContent } from '@/components/features/checkout/checkout-page-content';
import { readSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Thanh Toán Đơn Hàng | Bao Bì Đức Trọng',
  description:
    'Hoàn tất thông tin thanh toán đơn hàng bao bì, hỗ trợ thanh toán khi nhận hàng COD và chuyển khoản quét mã VietQR.',
};

export default async function CheckoutPage() {
  const currentUser = await readSession();

  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-[calc(100vh-80px)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[1360px] px-4 py-16 text-center text-gray-400">
              Đang tải trang thanh toán...
            </div>
          }
        >
          <CheckoutPageContent currentUser={currentUser} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
