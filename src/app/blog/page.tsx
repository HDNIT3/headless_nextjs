import type { Metadata } from 'next';
import { HeroBanner } from '@/components/layout/hero-banner';
import { NewsListSection } from '@/components/features/blog/news-list-section';
import { getNewsList } from '@/service/post.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tin Tức Về Chúng Tôi | Bao Bì Đức Trọng',
  description:
    'Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá trình đồng hành cùng doanh nghiệp và nông sản Việt.',
};

export default async function BlogPage() {
  const data = await getNewsList({ first: 10 });

  return (
    <div className="w-full flex flex-col">
      {/* Hero Banner with matching image and typography */}
      <HeroBanner />

      {/* Main News List Section */}
      <NewsListSection postsData={data.posts} />
    </div>
  );
}
