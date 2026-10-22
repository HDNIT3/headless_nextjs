import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HeroBanner } from '@/components/layout/hero-banner';
import { NewsListData } from '@/components/features/blog/news-list-data';
import { NewsListSkeleton } from '@/components/features/blog/news-list-skeleton';
import { PageTransition } from '@/components/common/page-transition';

export const metadata: Metadata = {
  title: 'Bao Bì Đức Trọng | Tin tức & Kiến thức bao bì nông sản',
  description:
    'Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá trình đồng hành cùng doanh nghiệp và nông sản Việt.',
};

export default function HomePage() {
  return (
    <PageTransition>
      <div className="w-full flex flex-col">
        <HeroBanner />
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsListData />
        </Suspense>
      </div>
    </PageTransition>
  );
}
