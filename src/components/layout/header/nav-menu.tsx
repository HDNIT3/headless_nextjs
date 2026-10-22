'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ProductCategoryNode } from '@/types/category';

export interface NavItem {
  label: string;
  href: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Về chúng tôi', href: '/ve-chung-toi' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Dịch vụ', href: '/dich-vu' },
  { label: 'Tin tức', href: '/blog' },
  { label: 'Hình ảnh', href: '/hinh-anh' },
  { label: 'Liên hệ', href: '/contact' },
];

interface NavMenuProps {
  categories?: ProductCategoryNode[];
}

export function NavMenu({ categories = [] }: NavMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentDanhmuc = searchParams.get('danhmuc');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="hidden lg:flex items-center gap-7">
      {MAIN_NAV_ITEMS.map((item) => {
        const isProductMenu = item.href === '/san-pham';
        const isProductActive = pathname.startsWith('/san-pham');
        const isActive =
          pathname === item.href ||
          (item.href === '/blog' && (pathname.startsWith('/blog') || pathname === '/')) ||
          (isProductMenu && isProductActive);

        // Menu "Sản phẩm" with Dropdown Categories
        if (isProductMenu && categories.length > 0) {
          return (
            <div
              key={item.href}
              ref={dropdownRef}
              className="relative py-5 flex items-center"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="inline-flex items-center gap-0.5">
                <Link
                  href={item.href}
                  className={`text-[15px] transition-colors py-1 ${
                    isActive
                      ? 'font-bold text-gray-900'
                      : 'text-gray-700 font-normal hover:text-[#0c5c36]'
                  }`}
                >
                  {item.label}
                </Link>

                {/* Dropdown toggle button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDropdownOpen((prev) => !prev);
                  }}
                  className="p-1.5 rounded-md text-gray-500 hover:text-[#0c5c36] hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Danh sách danh mục sản phẩm"
                  aria-expanded={isDropdownOpen}
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-[#0c5c36]' : ''
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

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 top-full -mt-1 pt-2 w-64 z-50 transition-all duration-200 ease-out origin-top-left ${
                  isDropdownOpen
                    ? 'opacity-100 visible translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 invisible -translate-y-2 scale-95 pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5 border border-gray-100 p-2 overflow-hidden">
                  <div className="flex flex-col gap-0.5">
                    {/* All products */}
                    <Link
                      href="/san-pham"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`px-3.5 py-2.5 rounded-lg text-[14px] transition-all flex items-center justify-between group/item ${
                        isProductActive && !currentDanhmuc
                          ? 'bg-green-50 text-[#0c5c36] font-semibold'
                          : 'text-gray-700 hover:bg-green-50/80 hover:text-[#0c5c36]'
                      }`}
                    >
                      <span>Tất cả sản phẩm</span>
                    </Link>

                    {categories.map((cat) => {
                      const catHref = `/san-pham?danhmuc=${encodeURIComponent(cat.name)}`;
                      const isCatActive = currentDanhmuc === cat.name;

                      return (
                        <Link
                          key={cat.id || cat.slug}
                          href={catHref}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`px-3.5 py-2.5 rounded-lg text-[14px] transition-all flex items-center justify-between group/item ${
                            isCatActive
                              ? 'bg-green-50 text-[#0c5c36] font-semibold'
                              : 'text-gray-700 hover:bg-green-50/80 hover:text-[#0c5c36]'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <svg
                            className={`w-3.5 h-3.5 text-gray-300 group-hover/item:text-[#0c5c36] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2 ${
                              isCatActive
                                ? 'opacity-100 text-[#0c5c36]'
                                : 'opacity-0 group-hover/item:opacity-100'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Standard Nav Item
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-[15px] transition-colors relative py-1 ${
              isActive
                ? 'font-bold text-gray-900'
                : 'text-gray-700 font-normal hover:text-[#0c5c36]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
