import { PageTransition } from '@/components/common/page-transition';
import { HeroBanner } from '@/components/layout/hero-banner';
import { NewsListSkeleton } from '@/components/features/blog/news-list-skeleton';

export default function BlogLoading() {
  return (
    <PageTransition>
      <div className="w-full flex flex-col">
        <HeroBanner />
        <NewsListSkeleton />
      </div>
    </PageTransition>
  );
}
