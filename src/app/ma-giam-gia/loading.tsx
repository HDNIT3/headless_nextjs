import { PageTransition } from '@/components/common/page-transition';
import { VoucherListSkeleton } from '@/components/features/voucher';

export default function MaGiamGiaLoading() {
  return (
    <PageTransition>
      <VoucherListSkeleton />
    </PageTransition>
  );
}
