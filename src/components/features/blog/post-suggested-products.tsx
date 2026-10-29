import Link from 'next/link';
import { ViewTransition } from 'react';
import { ProductCard } from '@/components/common/product-card';
import type { ProductNode } from '@/types/product';

interface PostSuggestedProductsProps {
  products: ProductNode[];
}

export function PostSuggestedProducts({ products }: PostSuggestedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full mt-14 pt-12 border-t border-gray-200">
      {/* Header + Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0c5c36] uppercase tracking-wide">
          Gợi ý các sản phẩm nổi bật
        </h2>

        {/* Thanh tìm kiếm nhanh sản phẩm */}
        <form
          action="/san-pham"
          method="GET"
          className="relative w-full sm:w-72 lg:w-80"
        >
          <input
            type="text"
            name="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-4 pr-10 py-2 text-[13.5px] bg-white border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c5c36]/20 focus:border-[#0c5c36] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c5c36] transition-colors"
            aria-label="Tìm kiếm sản phẩm"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
      </div>

      {/* Grid 10 sản phẩm (5 cột trên Desktop, responsive cho mobile/tablet) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {products.map((product) => (
          <ViewTransition key={product.id || product.slug}>
            <ProductCard product={product} />
          </ViewTransition>
        ))}
      </div>

      {/* Nút Xem thêm */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/san-pham"
          transitionTypes={['nav-forward']}
          className="inline-flex items-center justify-center px-10 py-2.5 rounded-lg border border-[#f15a24] text-[#f15a24] text-[13.5px] font-semibold hover:bg-[#f15a24] hover:text-white transition-all duration-200 shadow-xs"
        >
          Xem thêm
        </Link>
      </div>
    </section>
  );
}

