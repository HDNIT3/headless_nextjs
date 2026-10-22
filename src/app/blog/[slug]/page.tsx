import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ViewTransition } from 'react';
import { cleanHtml } from '@/lib/utils/clean-html';
import { PageTransition } from '@/components/common/page-transition';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import { getPostDetail } from '@/service/post.service';
import { getCurrentUser } from '@/service/auth.service';

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

  return {
    title: `${post.title} | Bao Bì Đức Trọng`,
    description: cleanHtml(post.excerpt) || undefined,
    openGraph: post.featuredImage?.node?.sourceUrl
      ? { images: [post.featuredImage.node.sourceUrl] }
      : undefined,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  // Kiểm tra đăng nhập: Người dùng chưa đăng nhập thì không xem được chi tiết bài viết
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/blog/${slug}`)}`);
  }

  const post = await getPostDetail(slug);
  if (!post) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
            <Link href="/" transitionTypes={['nav-back']} className="hover:text-[#0c5c36]">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/blog" transitionTypes={['nav-back']} className="hover:text-[#0c5c36]">
              Tin tức
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>

          <article className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-xs">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0c5c36] leading-tight mb-4">
              {post.title}
            </h1>

            <div className="text-xs text-gray-400 mb-8 pb-4 border-b border-gray-100">
              Ngày đăng:{' '}
              {new Date(post.date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {post.featuredImage?.node?.sourceUrl && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-gray-100">
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
                    className="object-cover"
                  />
                </ViewTransition>
              </div>
            )}

            {post.excerpt && (
              <div className="text-gray-600 font-medium text-base sm:text-lg leading-relaxed mb-6 italic border-l-4 border-[#0c5c36] pl-4">
                {cleanHtml(post.excerpt)}
              </div>
            )}

            {post.content ? (
              <div
                className="max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#0c5c36] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-gray-500">
                Nội dung bài viết đang được cập nhật.
              </p>
            )}

            <div className="mt-10 pt-6 border-t border-gray-100">
              <Link
                href="/blog"
                transitionTypes={['nav-back']}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c5c36] hover:text-[#f15a24] transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Quay lại danh sách tin tức
              </Link>
            </div>
          </article>
        </div>
      </div>
    </PageTransition>
  );
}
