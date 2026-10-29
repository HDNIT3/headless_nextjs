import { PageTransition } from '@/components/common/page-transition';
import { ProductHeroBanner } from '@/components/features/product/product-hero-banner';
import {
  ProductListSkeleton,
  ProductSidebarSkeleton,
} from '@/components/features/product/product-list-skeleton';

export default function SanPhamLoading() {
  return (
    <PageTransition>
      <div className="w-full flex flex-col">
        <ProductHeroBanner />

        <section className="w-full bg-[#fafbfc] py-8 sm:py-12">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <ProductListSkeleton />
              <ProductSidebarSkeleton />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
