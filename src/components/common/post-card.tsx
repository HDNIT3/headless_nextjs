import Link from 'next/link';
import { ViewTransition } from 'react';
import { ImageWithFallback } from './image-with-fallback';
import { cleanHtml } from '@/lib/utils/clean-html';
import type { PostNode } from '@/types/post';

interface PostCardProps {
  post: PostNode;
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.featuredImage?.node?.sourceUrl;
  const imageAlt = post.featuredImage?.node?.altText || post.title;
  const excerptText = cleanHtml(post.excerpt);

  return (
    <article className="group bg-white rounded-2xl border border-gray-100/90 shadow-[0_4px_22px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-3.5 flex flex-col h-full">
      {}
      <Link
        href={`/blog/${post.slug}`}
        transitionTypes={['nav-forward']}
        className="block relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
      >
        <ViewTransition
          name={`post-image-${post.slug}`}
          share="morph"
          default="none"
        >
          <ImageWithFallback
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </ViewTransition>
      </Link>

      {/* Body Content */}
      <div className="flex flex-col flex-1 pt-3.5 px-1 pb-1">
        <Link href={`/blog/${post.slug}`} transitionTypes={['nav-forward']}>
          <h3 className="text-[#0c5c36] font-bold text-[15px] sm:text-[16px] leading-[1.35] line-clamp-2 hover:text-[#f15a24] transition-colors mb-2">
            {post.title}
          </h3>
        </Link>

        {excerptText && (
          <p className="text-[#64748b] text-[13px] leading-[1.6] line-clamp-3 mb-4">
            {excerptText}
          </p>
        )}

        {/* Card Footer Link */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-transparent group-hover:border-gray-50 transition-colors">
          <Link
            href={`/blog/${post.slug}`}
            transitionTypes={['nav-forward']}
            className="text-[13px] font-medium text-[#0c5c36] group-hover:text-[#f15a24] transition-colors"
          >
            Xem chi tiết
          </Link>

          <Link
            href={`/blog/${post.slug}`}
            transitionTypes={['nav-forward']}
            className="text-[#0c5c36] group-hover:text-[#f15a24] group-hover:translate-x-1.5 transition-all duration-300"
            aria-label={`Xem chi tiết bài viết ${post.title}`}
          >
            <svg
              width="42"
              height="12"
              viewBox="0 0 42 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M1 6H40M40 6L34 1M40 6L34 11"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
