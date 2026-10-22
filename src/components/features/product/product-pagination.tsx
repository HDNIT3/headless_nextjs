'use client';

import { startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  endCursor?: string | null;
}

export function ProductPagination({
  currentPage,
  totalPages,
  hasNextPage,
  endCursor,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const navigateToPage = (page: number, cursor?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    if (cursor) {
      params.set('after', cursor);
    } else {
      params.delete('after');
    }
    const query = params.toString();
    startTransition(() => {
      router.push(`/san-pham${query ? `?${query}` : ''}`);
    });
  };

  // Generate page numbers to show
  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10 flex-wrap" aria-label="Phân trang">
      {/* Page info */}
      <span className="text-[13px] text-gray-500 mr-2">
        Trang {currentPage}/{totalPages}
      </span>

      {/* Page number buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => navigateToPage(page)}
          disabled={page === currentPage}
          className={`min-w-[36px] h-9 px-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${
            page === currentPage
              ? 'bg-[#0c5c36] text-white shadow-sm cursor-default'
              : 'text-gray-600 hover:bg-green-50 hover:text-[#0c5c36] border border-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      {hasNextPage && (
        <button
          onClick={() => navigateToPage(currentPage + 1, endCursor)}
          className="px-3 h-9 text-[13px] text-gray-600 hover:text-[#0c5c36] hover:bg-green-50 rounded-lg border border-gray-200 transition-all font-medium"
        >
          Kế tiếp
        </button>
      )}

      {/* Last page button */}
      {currentPage < totalPages && (
        <button
          onClick={() => navigateToPage(totalPages)}
          className="px-3 h-9 text-[13px] text-gray-600 hover:text-[#0c5c36] hover:bg-green-50 rounded-lg border border-gray-200 transition-all font-medium"
        >
          Cuối cùng
        </button>
      )}
    </nav>
  );
}
