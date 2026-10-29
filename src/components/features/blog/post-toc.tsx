'use client';

import type { TocItem } from '@/lib/utils/toc';

interface PostTocProps {
  toc: TocItem[];
}

export function PostToc({ toc }: PostTocProps) {
  if (!toc || toc.length === 0) return null;

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const getLetter = (index: number) => {
    return String.fromCharCode(97 + (index % 26)) + '.';
  };

  return (
    <nav
      aria-label="Mục lục bài viết"
      className="my-8 rounded-xl border border-gray-200 bg-[#f9fafb] p-5 sm:p-6 shadow-xs"
    >
      <div className="space-y-2.5 text-[14px] leading-relaxed text-gray-800">
        {toc.map((item, idx) => (
          <div key={item.id} className="space-y-1.5">
            {/* Mục cấp 1 (H2) - 1. 2. 3. */}
            <div className="font-semibold text-gray-900">
              <a
                href={`#${item.id}`}
                onClick={(e) => scrollToHeading(e, item.id)}
                className="hover:text-[#0c5c36] transition-colors"
              >
                <span className="mr-1.5">{idx + 1}.</span>
                <span>{item.text}</span>
              </a>
            </div>

            {/* Các mục con cấp 2 (H3) - a. b. c. */}
            {item.subItems && item.subItems.length > 0 && (
              <div className="ml-5 space-y-1 text-[13.5px] text-gray-700">
                {item.subItems.map((sub, subIdx) => (
                  <div key={sub.id}>
                    <a
                      href={`#${sub.id}`}
                      onClick={(e) => scrollToHeading(e, sub.id)}
                      className="hover:text-[#0c5c36] hover:underline transition-colors block py-0.5"
                    >
                      <span className="mr-1.5 font-medium">{getLetter(subIdx)}</span>
                      <span>{sub.text}</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

