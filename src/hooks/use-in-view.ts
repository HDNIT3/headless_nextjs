'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** Khoảng cách trước khi phần tử chạm vào khung nhìn (mặc định '200px' để tải trước mượt mà) */
  rootMargin?: string;
  /** Tỉ lệ phần tử lọt vào màn hình (0 - 1) */
  threshold?: number | number[];
  /** Chỉ kích hoạt một lần duy nhất rồi ngắt observer (mặc định: true) */
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  rootMargin = '200px',
  threshold = 0,
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(() => {
    // Nếu môi trường không có IntersectionObserver (SSR / browser cũ), mặc định coi như true
    return typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined';
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, triggerOnce]);

  return { ref, isInView };
}

