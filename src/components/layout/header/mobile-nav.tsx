'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAV_ITEMS } from './nav-menu';
import { ProductCategoryNode } from '@/types/category';

interface MobileNavProps {
  categories?: ProductCategoryNode[];
}

export function MobileNav({ categories = [] }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-[#0c5c36] focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 w-72 h-full bg-white shadow-2xl p-6 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <span className="font-bold text-[#0c5c36] text-lg">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-900"
            aria-label="Đóng menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 mt-6">
          {MAIN_NAV_ITEMS.map((item) => {
            const isProductMenu = item.href === '/san-pham';
            const isProductActive = pathname.startsWith('/san-pham');
            const isActive =
              pathname === item.href ||
              (item.href === '/blog' && (pathname.startsWith('/blog') || pathname === '/')) ||
              (isProductMenu && isProductActive);

            if (isProductMenu && categories.length > 0) {
              return (
                <div key={item.href} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-base transition-colors ${
                        isActive
                          ? 'bg-green-50 font-semibold text-[#0c5c36]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                      className="p-2 text-gray-500 hover:text-[#0c5c36] focus:outline-none"
                      aria-label="Mở rộng danh mục sản phẩm"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isProductsExpanded ? 'rotate-180 text-[#0c5c36]' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Sub-menu categories */}
                  {isProductsExpanded && (
                    <div className="pl-4 pr-1 py-1 flex flex-col gap-1 border-l-2 border-green-100 ml-4 my-1">
                      <Link
                        href="/san-pham"
                        onClick={() => setIsOpen(false)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === '/san-pham'
                            ? 'text-[#0c5c36] font-semibold bg-green-50/80'
                            : 'text-gray-600 hover:text-[#0c5c36] hover:bg-gray-50'
                        }`}
                      >
                        Tất cả sản phẩm
                      </Link>
                      {categories.map((cat) => {
                        const catHref = `/san-pham?danhmuc=${encodeURIComponent(cat.name)}`;
                        return (
                          <Link
                            key={cat.id || cat.slug}
                            href={catHref}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 hover:text-[#0c5c36] hover:bg-gray-50"
                          >
                            {cat.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base transition-colors ${
                  isActive
                    ? 'bg-green-50 font-semibold text-[#0c5c36]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-[#f15a24] hover:bg-[#e04c06] text-white font-medium py-3 rounded-lg text-sm shadow-sm transition-colors"
          >
            Liên hệ báo giá
          </Link>
        </div>
      </div>
    </div>
  );
}
