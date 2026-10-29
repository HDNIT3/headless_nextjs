'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setIsLoading(false);
      setProgress(100);
    });

    const timer = setTimeout(() => {
      if (active) {
        setProgress(0);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        (targetAttr && targetAttr !== '_self') ||
        e.defaultPrevented ||
        e.button !== 0 || 
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;

        const isCurrentUrl =
          url.pathname === window.location.pathname &&
          url.search === window.location.search;

        if (isCurrentUrl && !url.hash) {
          return;
        }

        startTransition(() => {
          setIsLoading(true);
          setProgress(25);
        });
      } catch {
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [startTransition]);

  useEffect(() => {
    if (!isLoading) return;

    const t1 = setTimeout(() => {
      setProgress((prev) => (prev < 65 ? 65 : prev));
    }, 150);

    const t2 = setTimeout(() => {
      setProgress((prev) => (prev < 85 ? 85 : prev));
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-[#0c5c36] via-[#107042] to-[#f15a24] shadow-[0_0_10px_rgba(12,92,54,0.5)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isLoading || progress < 100 ? 1 : 0,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
