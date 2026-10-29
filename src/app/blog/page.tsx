import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HeroBanner } from '@/components/layout/hero-banner';
import { NewsListData } from '@/components/features/blog/news-list-data';
import { NewsListSkeleton } from '@/components/features/blog/news-list-skeleton';
import { PageTransition } from '@/components/common/page-transition';

export const metadata: Metadata = {
  title: 'Tin Tức Về Chúng Tôi | Bao Bì Đức Trọng',
  description:
    'Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá trình đồng hành cùng doanh nghiệp và nông sản Việt.',
};

interface BlogPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  if (searchParams) {
    await searchParams;
  }

  return (
    <PageTransition>
      <div className="w-full flex flex-col">
        {}
        <HeroBanner />

        {}
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsListData />
        </Suspense>
      </div>
    </PageTransition>
  );
}
