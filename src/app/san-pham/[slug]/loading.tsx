import { PageTransition } from '@/components/common/page-transition';
import { ProductDetailSkeleton } from '@/components/features/product/product-detail-skeleton';

export default function ProductDetailLoading() {
  return (
    <PageTransition>
      <ProductDetailSkeleton />
    </PageTransition>
  );
}
