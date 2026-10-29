import Link from 'next/link';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import { cleanHtml } from '@/lib/utils/clean-html';
import type { PostNode } from '@/types/post';

interface RelatedPostsSidebarProps {
  posts: PostNode[];
  currentSlug: string;
}

export function RelatedPostsSidebar({
  posts,
  currentSlug,
}: RelatedPostsSidebarProps) {
  // Lọc bỏ bài viết hiện tại đang xem
  const relatedList = posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 6);

  if (relatedList.length === 0) return null;

  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        {/* Header Widget */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-[16px] sm:text-[17px] font-bold text-[#0c5c36]">
            Bài viết khác liên quan
          </h2>
          <Link
            href="/blog"
            transitionTypes={['nav-forward']}
            className="text-xs text-gray-500 hover:text-[#0c5c36] font-medium transition-colors"
          >
            Xem thêm
          </Link>
        </div>

        {/* Danh sách bài viết liên quan */}
        <div className="divide-y divide-gray-100">
          {relatedList.map((item) => {
            const excerpt = cleanHtml(item.excerpt);
            const imageUrl = item.featuredImage?.node?.sourceUrl;
            const imageAlt = item.featuredImage?.node?.altText || item.title;

            return (
              <article key={item.databaseId || item.slug} className="py-3.5 first:pt-0 last:pb-0 group">
                <Link
                  href={`/blog/${item.slug}`}
                  transitionTypes={['nav-forward']}
                  className="flex gap-3"
                >
                  {/* Thumbnail bên trái */}
                  <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Thông tin bài viết bên phải */}
                  <div className="flex flex-col flex-1 min-w-0 justify-between">
                    <div>
                      <h3 className="text-xs sm:text-[13px] font-semibold text-gray-900 group-hover:text-[#0c5c36] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      {excerpt && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-normal">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-1 text-[11.5px] font-semibold text-[#0c5c36] group-hover:text-[#f15a24] transition-colors">
                      <span>Xem chi tiết</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

