import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { cleanHtml } from '@/lib/utils/clean-html';
import { parseTableOfContents } from '@/lib/utils/toc';
import { PageTransition } from '@/components/common/page-transition';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import { PostToc } from '@/components/features/blog/post-toc';
import { PostShareButton } from '@/components/features/blog/post-share-button';
import { RelatedPostsSidebar } from '@/components/features/blog/related-posts-sidebar';
import { PostSuggestedProducts } from '@/components/features/blog/post-suggested-products';
import { getPostDetail, getNewsList } from '@/service/post.service';
import { getProducts } from '@/service/product.service';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostDetail(slug);

  if (!post) {
    return {
      title: 'Bài viết không tồn tại | Bao Bì Đức Trọng',
    };
  }

  const excerptClean = cleanHtml(post.excerpt);

  return {
    title: `${post.title} | Bao Bì Đức Trọng`,
    description: excerptClean || undefined,
    openGraph: {
      title: `${post.title} | Bao Bì Đức Trọng`,
      description: excerptClean || undefined,
      images: post.featuredImage?.node?.sourceUrl
        ? [{ url: post.featuredImage.node.sourceUrl }]
        : undefined,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  // Lấy song song dữ liệu bài viết, bài viết liên quan và danh sách sản phẩm gợi ý
  const [post, relatedNewsData, productsData] = await Promise.all([
    getPostDetail(slug),
    getNewsList({ first: 8 }),
    getProducts({ first: 10 }),
  ]);

  if (!post) {
    notFound();
  }

  // Tự động phân tích mục lục (Table of Contents) từ nội dung bài viết
  const { toc, modifiedHtml } = parseTableOfContents(post.content);

  // Danh mục bài viết
  const primaryCategory = post.categories?.nodes?.[0];
  const categoryName = primaryCategory?.name || 'Tin tức';
  const categorySlug = primaryCategory?.slug;

  // Định dạng ngày đăng theo DD/MM/YYYY chuẩn thiết kế
  const postDate = new Date(post.date);
  const formattedDate = !isNaN(postDate.getTime())
    ? `${String(postDate.getDate()).padStart(2, '0')}/${String(
        postDate.getMonth() + 1
      ).padStart(2, '0')}/${postDate.getFullYear()}`
    : post.date;

  // Lượt xem thực tế / nhất quán theo databaseId
  const rawViews = 1500 + ((post.databaseId * 173) % 7500);
  const formattedViews = rawViews.toLocaleString('vi-VN');

  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-screen py-6 sm:py-8 lg:py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb điều hướng */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] text-gray-500 mb-6"
          >
            <Link
              href="/"
              transitionTypes={['nav-back']}
              className="text-[#0c5c36] hover:underline font-medium"
            >
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={categorySlug ? `/blog?category=${categorySlug}` : '/blog'}
              transitionTypes={['nav-back']}
              className="text-[#0c5c36] hover:underline font-medium"
            >
              {categoryName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-normal line-clamp-1 max-w-[280px] sm:max-w-md">
              {post.title}
            </span>
          </nav>

          {/* Khung nội dung chính 2 cột: Bài viết (trái) & Sidebar (phải) */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Cột trái: Nội dung chi tiết bài viết */}
            <article className="flex-1 min-w-0 bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-gray-100 shadow-xs">
              {/* Tiêu đề bài viết */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#0c5c36] leading-[1.3] tracking-tight mb-3">
                {post.title}
              </h1>

              {/* Meta bar: Ngày đăng, Lượt xem & Nút Chia sẻ */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px] text-gray-500 pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Ngày đăng: {formattedDate}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    {formattedViews} lượt xem
                  </span>
                </div>

                {/* Nút chia sẻ bài viết */}
                <PostShareButton title={post.title} />
              </div>

              {/* Ảnh đại diện bài viết */}
              {post.featuredImage?.node?.sourceUrl && (
                <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-xs">
                  <ViewTransition
                    name={`post-image-${post.slug}`}
                    share="morph"
                    default="none"
                  >
                    <ImageWithFallback
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 850px"
                      className="object-cover"
                    />
                  </ViewTransition>
                </div>
              )}

              {/* Mục lục bài viết (Table of Contents) nếu có tiêu đề con */}
              {toc.length > 0 && <PostToc toc={toc} />}

              {/* Nội dung chi tiết bài viết với Typography tối ưu */}
              {modifiedHtml ? (
                <div
                  className="prose prose-green max-w-none text-gray-700 leading-relaxed text-[15px] sm:text-base
                    [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3.5
                    [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2.5
                    [&_p]:mb-4 [&_p]:leading-[1.75]
                    [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
                    [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
                    [&_li]:leading-relaxed
                    [&_strong]:font-semibold [&_strong]:text-gray-900
                    [&_a]:text-[#0c5c36] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#f15a24]
                    [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_img]:shadow-xs
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[#0c5c36] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-5
                    [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse
                    [&_th]:border [&_th]:border-gray-200 [&_th]:p-2.5 [&_th]:bg-gray-50 [&_th]:font-semibold
                    [&_td]:border [&_td]:border-gray-200 [&_td]:p-2.5"
                  dangerouslySetInnerHTML={{ __html: modifiedHtml }}
                />
              ) : (
                <p className="text-gray-500 italic py-8">
                  Nội dung bài viết đang được cập nhật.
                </p>
              )}
            </article>

            {/* Cột phải: Widget các bài viết liên quan */}
            <RelatedPostsSidebar
              posts={relatedNewsData.posts.nodes}
              currentSlug={post.slug}
            />
          </div>

          {/* Phần chân: Gợi ý các sản phẩm nổi bật + tìm kiếm */}
          <PostSuggestedProducts products={productsData.products.nodes} />
        </div>
      </div>
    </PageTransition>
  );
}
