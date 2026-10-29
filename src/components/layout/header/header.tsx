import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderNav } from './header-nav';
import { HeaderMobileNav } from './header-mobile-nav';
import { HeaderUser } from './header-user';
import { CartBadge } from './cart-badge';

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs"
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <Image
            src="/icons/site_icon.png"
            alt="Bao Bì Đức Trọng"
            width={160}
            height={50}
            className="h-11 sm:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {}
        <Suspense fallback={<div className="hidden lg:block flex-1" />}>
          <div className="hidden lg:flex flex-1 justify-center">
            <HeaderNav />
          </div>
        </Suspense>

        {}
        <div className="flex items-center gap-2 sm:gap-3">
          {}
          <CartBadge />

          <Suspense
            fallback={
              <div
                className="h-8 w-24 rounded-full bg-gray-100 animate-pulse"
                aria-hidden
              />
            }
          >
            <HeaderUser />
          </Suspense>

          {}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center bg-[#f15a24] hover:bg-[#e04c06] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all shadow-xs"
          >
            Liên hệ báo giá
          </Link>

          {}
          <Suspense
            fallback={<div className="lg:hidden h-10 w-10" aria-hidden />}
          >
            <HeaderMobileNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
