'use client';

import React, { type ReactNode } from 'react';
import { useInView, type UseInViewOptions } from '@/hooks/use-in-view';

export interface LazySectionProps extends UseInViewOptions {
  /** Nội dung section sẽ được mount và hiển thị khi cuộn tới */
  children: ReactNode;
  /** Skeleton hoặc placeholder hiển thị khi section chưa xuất hiện trong khung nhìn */
  fallback: ReactNode;
  /** Chiều cao tối thiểu ban đầu để giữ chỗ, tránh giật khung hình (CLS) */
  minHeight?: string | number;
  /** ClassName bổ sung */
  className?: string;
  /** Thẻ HTML bọc ngoài (mặc định: 'div') */
  as?: 'div' | 'section' | 'aside' | 'article';
}

export function LazySection({
  children,
  fallback,
  minHeight,
  rootMargin = '200px',
  threshold = 0,
  triggerOnce = true,
  className = '',
  as = 'div',
}: LazySectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    rootMargin,
    threshold,
    triggerOnce,
  });

  const Component = as;

  return (
    <Component
      ref={ref}
      className={`w-full transition-opacity duration-300 ${
        isInView ? 'opacity-100' : 'opacity-90'
      } ${className}`.trim()}
      style={!isInView && minHeight ? { minHeight } : undefined}
    >
      {isInView ? children : fallback}
    </Component>
  );
}

