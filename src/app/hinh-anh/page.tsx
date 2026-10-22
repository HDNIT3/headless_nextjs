import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import { GalleryHero } from '@/components/features/gallery/gallery-hero';
import { GalleryData } from '@/components/features/gallery/gallery-data';
import { GallerySkeleton } from '@/components/features/gallery/gallery-skeleton';
import {
  parseGalleryFilters,
  type GallerySearchParams,
} from '@/lib/utils/gallery-filters';

export const metadata: Metadata = {
  title: 'Hình Ảnh & Video | Bao Bì Đức Trọng',
  description:
    'Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá trình đồng hành cùng doanh nghiệp và nông sản Việt.',
};

interface GalleryPageProps {
  searchParams: Promise<GallerySearchParams>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const filters = parseGalleryFilters(await searchParams);

  return (
    <PageTransition>
      <div className="flex w-full flex-col">
        <GalleryHero />

        <Suspense fallback={<GallerySkeleton />}>
          <GalleryData activeSlug={filters.categorySlug} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
