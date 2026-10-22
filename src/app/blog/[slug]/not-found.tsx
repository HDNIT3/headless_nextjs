import { NotFoundView } from '@/components/common/not-found-view';

export default function PostNotFound() {
  return (
    <NotFoundView
      title="Bài viết không tồn tại"
      description="Bài viết này có thể đã bị xoá hoặc đường dẫn không còn đúng."
      primaryHref="/blog"
      primaryLabel="Xem tất cả tin tức"
    />
  );
}
