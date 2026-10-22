import Link from 'next/link';
import type { GalleryTerm } from '@/types/gallery';

interface GalleryFiltersProps {
  terms: GalleryTerm[];
  activeSlug: string | null;
}

function pillClass(active: boolean) {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border bg-white px-5 py-2 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c5c36]/30 focus-visible:ring-offset-2 sm:px-6 sm:py-2.5 sm:text-[16px] lg:px-[30px] lg:text-[18px]';

  return active
    ? `${base} border-[#7A7A7A] text-[#7A7A7A]`
    : `${base} border-gray-300 text-gray-600 hover:border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white`;
}

export function GalleryFilters({ terms, activeSlug }: GalleryFiltersProps) {
  return (
    <nav
      aria-label="Phân loại hình ảnh"
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
    >
      <Link
        href="/hinh-anh"
        scroll={false}
        aria-current={activeSlug === null ? 'page' : undefined}
        className={pillClass(activeSlug === null)}
      >
        Tất cả
      </Link>

      {terms.map((term) => {
        const active = activeSlug === term.slug;

        return (
          <Link
            key={term.slug}
            href={`/hinh-anh?phanloai=${encodeURIComponent(term.slug)}`}
            scroll={false}
            aria-current={active ? 'page' : undefined}
            className={pillClass(active)}
          >
            {term.name}
          </Link>
        );
      })}
    </nav>
  );
}
