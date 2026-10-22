'use client';

import { useState } from 'react';
import { GalleryCard } from './gallery-card';
import {
  GALLERY_INITIAL_VISIBLE,
  GALLERY_LOAD_MORE_STEP,
} from '@/lib/utils/gallery-filters';
import type { GalleryItem } from '@/types/gallery';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(GALLERY_INITIAL_VISIBLE);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-[#fafbfc] px-6 py-16 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mx-auto mb-4 text-gray-300"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-[15px] text-gray-500">
          Chưa có hình ảnh nào được đăng tải.
        </p>
      </div>
    );
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-[30px]">
        {visibleItems.map((item, index) => (
          <GalleryCard
            key={item.databaseId || item.slug}
            item={item}
            featured={index === 0}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center sm:mt-12">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((current) =>
                Math.min(current + GALLERY_LOAD_MORE_STEP, items.length)
              )
            }
            className="rounded-[10px] border border-[#0c5c36] bg-white px-8 py-3 text-[15px] font-medium text-[#0c5c36] transition-colors duration-200 hover:bg-[#0c5c36] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c5c36]/30 focus-visible:ring-offset-2 sm:px-[50px] sm:py-3.5 sm:text-[16px]"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}
