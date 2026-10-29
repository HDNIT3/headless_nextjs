import { PageTransition } from '@/components/common/page-transition';
import { GalleryHero } from '@/components/features/gallery/gallery-hero';
import { GallerySkeleton } from '@/components/features/gallery/gallery-skeleton';

export default function GalleryLoading() {
  return (
    <PageTransition>
      <div className="flex w-full flex-col">
        <GalleryHero />
        <GallerySkeleton />
      </div>
    </PageTransition>
  );
}
