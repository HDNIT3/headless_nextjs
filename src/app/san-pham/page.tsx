import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import { ProductHeroBanner } from '@/components/features/product/product-hero-banner';
import { ProductResults } from '@/components/features/product/product-results';
import { LazyProductSidebar } from '@/components/features/product/lazy-product-sidebar';
import { ProductListSkeleton } from '@/components/features/product/product-list-skeleton';
import {
  parseProductFilters,
  type ProductSearchParams,
} from '@/lib/utils/product-filters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Sản phẩm | Bao Bì Đức Trọng',
  description:
    'Khám phá các sản phẩm bao bì chất lượng cao từ Bao Bì Đức Trọng. Thùng xốp, hộp xốp, khay nhựa và nhiều hơn nữa.',
};

interface SanPhamPageProps {
  searchParams: Promise<ProductSearchParams>;
}

export default async function SanPhamPage({ searchParams }: SanPhamPageProps) {
  const filters = parseProductFilters(await searchParams);

  return (
    <PageTransition>
      <div className="w-full flex flex-col">
        <ProductHeroBanner />

        <section className="w-full bg-[#fafbfc] py-8 sm:py-12">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Danh sách sản phẩm chính (Server Component Streaming tối ưu SEO) */}
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductResults filters={filters} />
              </Suspense>

              {/* Bộ lọc Sidebar (Tải khi cuộn tới trên mobile, tức thì trên desktop) */}
              <LazyProductSidebar filterKey={JSON.stringify(filters)} />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
