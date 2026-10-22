import Link from 'next/link';
import { PageTransition } from '@/components/common/page-transition';

interface NotFoundViewProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function NotFoundView({
  title = 'Không tìm thấy trang',
  description = 'Trang bạn đang tìm có thể đã bị di chuyển, xoá hoặc không còn tồn tại.',
  primaryHref = '/',
  primaryLabel = 'Về trang chủ',
  secondaryHref = '/san-pham',
  secondaryLabel = 'Xem sản phẩm',
}: NotFoundViewProps) {
  return (
    <PageTransition>
      <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fafbfc] px-4 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 text-center shadow-xs">
          <p className="text-6xl font-black tracking-tight text-[#0c5c36]">
            404
          </p>

          <h1 className="mt-4 text-xl sm:text-2xl font-extrabold text-gray-900">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {description}
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={primaryHref}
              className="w-full sm:w-auto rounded-lg bg-[#0c5c36] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#09472a]"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="w-full sm:w-auto rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
