import { getNewsList } from '@/service/post.service';
import { NewsListSection } from './news-list-section';

interface NewsListDataProps {
  first?: number;
  title?: string;
  subtitle?: string;
}

/**
 * Server component that owns the news fetch. Pages render it inside Suspense
 * so the hero/banner can stream immediately.
 */
export async function NewsListData({
  first = 10,
  title,
  subtitle,
}: NewsListDataProps) {
  const data = await getNewsList({ first });

  return (
    <NewsListSection postsData={data.posts} title={title} subtitle={subtitle} />
  );
}
