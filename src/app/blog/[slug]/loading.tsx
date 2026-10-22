import { PageTransition } from '@/components/common/page-transition';
import { PostDetailSkeleton } from '@/components/features/blog/post-detail-skeleton';

export default function PostDetailLoading() {
  return (
    <PageTransition>
      <PostDetailSkeleton />
    </PageTransition>
  );
}
