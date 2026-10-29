import Link from 'next/link';
import { ViewTransition } from 'react';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import type { ProductNode } from '@/types/product';

interface ProductCardProps {
  product: ProductNode;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image?.sourceUrl;
  const luotMua = product.thongtinsanpham?.luotmua ?? 0;

  return (
    <article className="group bg-white rounded-xl border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 p-2.5 flex flex-col h-full">
      {}
      <Link
        href={`/san-pham/${product.slug}`}
        transitionTypes={['nav-forward']}
        className="block relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50"
      >
        <ViewTransition
          name={`product-image-${product.slug}`}
          share="morph"
          default="none"
        >
          <ImageWithFallback
            src={imageUrl}
            alt={product.image?.altText || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </ViewTransition>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 pt-2.5 px-0.5 pb-0.5">
        {/* Title */}
        <Link href={`/san-pham/${product.slug}`} transitionTypes={['nav-forward']}>
          <h3 className="text-gray-800 font-semibold text-[13px] sm:text-[14px] leading-[1.4] line-clamp-1 hover:text-[#f15a24] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Lượt mua - below title */}

          <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {luotMua.toLocaleString('vi-VN')} lượt mua
          </span>

        {/* CTA Button */}
        <div className="mt-auto pt-2.5">
          <Link
            href="/contact"
            className="block w-full text-center py-2 px-3 border border-[#f15a24] text-[#f15a24] text-[12px] font-medium rounded-md hover:bg-[#f15a24] hover:text-white transition-all duration-200"
          >
            Liên hệ báo giá ngay
          </Link>
        </div>
      </div>
    </article>
  );
}
