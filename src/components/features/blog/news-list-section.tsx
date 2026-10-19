import { PostCard } from '@/components/common/post-card';
import type { PostsConnection } from '@/types/post';

interface NewsListSectionProps {
  postsData: PostsConnection;
  title?: string;
  subtitle?: string;
}

export function NewsListSection({
  postsData,
  title = 'TIN TỨC VỀ CHÚNG TÔI',
  subtitle = 'Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá trình đồng hành cùng doanh nghiệp và nông sản Việt.',
}: NewsListSectionProps) {
  const posts = postsData.nodes || [];

  return (
    <section className="w-full bg-[#fafbfc] py-12 sm:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c5c36] uppercase tracking-wide">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {posts.map((post) => (
              <PostCard key={post.databaseId || post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
            <p className="text-gray-500 text-base">
              Hiện chưa có bài viết nào được đăng tải.
            </p>
          </div>
        )}

        {/* Optional Pagination / Load More if hasNextPage */}
        {postsData.pageInfo?.hasNextPage && (
          <div className="mt-12 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#0c5c36] text-[#0c5c36] font-medium text-sm rounded-lg hover:bg-[#0c5c36] hover:text-white transition-all shadow-xs"
            >
              <span>Xem thêm bài viết</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
