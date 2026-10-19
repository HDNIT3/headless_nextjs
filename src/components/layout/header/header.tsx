import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavMenu } from './nav-menu';
import { MobileNav } from './mobile-nav';
import { getProductCategories } from '@/service/category.service';
import { getCurrentUser } from '@/service/auth.service';

export async function Header() {
  const [categories, user] = await Promise.all([
    getProductCategories(),
    getCurrentUser(),
  ]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
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

        {/* Desktop Navigation */}
        <Suspense fallback={<nav className="hidden lg:flex items-center gap-7" />}>
          <NavMenu categories={categories} />
        </Suspense>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* User Auth / Profile Button */}
          {user ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-[#0c5c36] text-xs sm:text-sm font-semibold transition-colors"
              title="Xem trang cá nhân"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#0c5c36] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span className="max-w-[90px] truncate hidden md:inline">{user.name}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0c5c36] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Contact Quote Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center bg-[#f15a24] hover:bg-[#e04c06] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all shadow-xs"
          >
            Liên hệ báo giá
          </Link>

          {/* Mobile Navigation Trigger */}
          <MobileNav categories={categories} />
        </div>
      </div>
    </header>
  );
}
