import { HeroBanner } from '@/components/layout/hero-banner';
import { NewsListSection } from '@/components/features/blog/news-list-section';
import { getNewsList } from '@/service/post.service';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bao Bì Đức Trọng | Tin tức & Kiến thức bao bì nông sản',
  description:
    'Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá trình đồng hành cùng doanh nghiệp và nông sản Việt.',
};

export default async function HomePage() {
  const data = await getNewsList({ first: 10 });

  return (
    <div className="w-full flex flex-col">
      <HeroBanner />
      <NewsListSection postsData={data.posts} />
    </div>
  );
}
