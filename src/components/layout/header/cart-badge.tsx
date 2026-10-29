'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/cart-context';

export function CartBadge() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/gio-hang"
      className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:text-[#0c5c36] hover:bg-gray-100 transition-colors"
      title="Xem giỏ hàng"
      aria-label="Giỏ hàng"
    >
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f15a24] px-1 text-[11px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </Link>
  );
}
