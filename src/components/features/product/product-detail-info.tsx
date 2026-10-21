import Link from 'next/link';
import { ContactFeatures } from '@/components/features/contact/contact-features';
import { getProductSpecs } from '@/lib/utils/product';
import type { ProductDetailNode } from '@/types/product';

interface ProductDetailInfoProps {
  product: ProductDetailNode;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const specs = getProductSpecs(product);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold uppercase leading-tight tracking-wide text-gray-900">
        {product.name}
      </h1>

      <div className="mt-4 border-b border-gray-200" />

      {specs.length > 0 && (
        <ul className="mt-5 space-y-2.5 text-[14px] leading-relaxed text-gray-700">
          {specs.map((spec) => (
            <li key={spec.label} className="flex items-start gap-2.5">
              <span className="mt-[1px] select-none text-[15px] leading-[1.4] text-black">
                •
              </span>
              <span>
                <span className="font-bold text-gray-900">{spec.label}:</span>{' '}
                {spec.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/contact"
          className="flex items-center justify-center rounded-md border border-[#f15a24] px-4 py-2.5 text-[13px] sm:text-[14px] font-semibold text-[#f15a24] transition-colors hover:bg-[#f15a24] hover:text-white"
        >
          Liên hệ báo giá ngay
        </Link>

        <a
          href="tel:0986124330"
          className="flex items-center justify-center gap-2 rounded-md bg-[#f15a24] px-4 py-2.5 text-[13px] sm:text-[14px] font-semibold text-white transition-colors hover:bg-[#d94d1a]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Hotline: 0986 124 330
        </a>
      </div>

      <div className="mt-5 rounded-lg bg-gradient-to-r from-[#fdf3ea] to-[#fbe9d8] px-4 py-4">
        <ContactFeatures />
      </div>
    </div>
  );
}
