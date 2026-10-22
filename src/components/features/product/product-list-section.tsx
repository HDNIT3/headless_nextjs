import Link from 'next/link';
import { ViewTransition } from 'react';
import { ProductCard } from '@/components/common/product-card';
import { ProductPagination } from './product-pagination';
import type { ProductNode } from '@/types/product';
import type { PageInfo } from '@/types/common';

interface ProductListSectionProps {
  products: ProductNode[];
  pageInfo: PageInfo & {
    hasPreviousPage?: boolean;
    startCursor?: string | null;
  };
  currentPage: number;
  totalPages: number;
  activeCategory?: string;
}

export function ProductListSection({
  products,
  pageInfo,
  currentPage,
  totalPages,
  activeCategory,
}: ProductListSectionProps) {
  return (
    <div className="flex-1 min-w-0">
      {/* Breadcrumb */}
      <div className="mb-1">
        <nav className="text-[13px] text-gray-500" aria-label="Breadcrumb">
          <Link href="/san-pham" className="text-[#0c5c36] hover:underline font-medium">
            Sản phẩm
          </Link>
          {activeCategory && (
            <>
              <span className="mx-1.5 text-gray-400">/</span>
              <span className="text-gray-600">{activeCategory}</span>
            </>
          )}
        </nav>
      </div>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-wide mb-5">
        Chi tiết các sản phẩm
      </h2>

      {/* Product Grid — 4 columns on large screens */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ViewTransition key={product.id || product.slug}>
              <ProductCard product={product} />
            </ViewTransition>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-gray-300 mb-4">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-500 text-[15px]">
            Không tìm thấy sản phẩm nào phù hợp.
          </p>
          <p className="text-gray-400 text-[13px] mt-1">
            Vui lòng thử lại với bộ lọc khác.
          </p>
        </div>
      )}

      {/* Pagination */}
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={pageInfo.hasNextPage}
        endCursor={pageInfo.endCursor}
      />
    </div>
  );
}
