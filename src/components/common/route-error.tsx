'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
  description?: string;
}

/**
 * Shared UI for route-level error boundaries. Next.js 16 exposes `retry()`
 * (instead of the older `reset()`) so the segment is re-fetched and re-rendered.
 */
export function RouteError({
  error,
  retry,
  title = 'Đã xảy ra lỗi',
  description = 'Không thể tải nội dung lúc này. Vui lòng thử lại sau ít phút.',
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fafbfc] px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 text-center shadow-xs">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {description}
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-gray-400">
            Mã lỗi: <span className="font-mono">{error.digest}</span>
          </p>
        )}

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="w-full sm:w-auto rounded-lg bg-[#0c5c36] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#09472a]"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
