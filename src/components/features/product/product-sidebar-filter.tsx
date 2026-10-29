'use client';

import { useState, useCallback, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductCategoryNode } from '@/types/category';
import type { AttributeNode } from '@/types/product';

interface ProductSidebarFilterProps {
  categories: ProductCategoryNode[];
  kichThuocs: AttributeNode[];
  mauSacs: AttributeNode[];
}

export function ProductSidebarFilter({
  categories,
  kichThuocs,
  mauSacs,
}: ProductSidebarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategories = searchParams.getAll('danhmuc');
  const currentKichThuocs = searchParams.getAll('kichthuoc');
  const currentMauSacs = searchParams.getAll('mausac');

  const [search, setSearch] = useState(currentSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories);
  const [selectedKichThuocs, setSelectedKichThuocs] = useState<string[]>(currentKichThuocs);
  const [selectedMauSacs, setSelectedMauSacs] = useState<string[]>(currentMauSacs);

  const toggleItem = (list: string[], item: string): string[] => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    selectedCategories.forEach((c) => params.append('danhmuc', c));
    selectedKichThuocs.forEach((k) => params.append('kichthuoc', k));
    selectedMauSacs.forEach((m) => params.append('mausac', m));

    const query = params.toString();
    startTransition(() => {
      router.push(`/san-pham${query ? `?${query}` : ''}`);
    });
  }, [search, selectedCategories, selectedKichThuocs, selectedMauSacs, router]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedKichThuocs([]);
    setSelectedMauSacs([]);
    startTransition(() => {
      router.push('/san-pham');
    });
  }, [router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <aside className="w-full lg:w-[300px] shrink-0 space-y-5">
      {}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c5c36]/20 focus:border-[#0c5c36] transition-all"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#0c5c36] transition-colors"
          aria-label="Tìm kiếm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      {}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <h3 className="font-bold text-[15px] text-gray-800 uppercase">Bộ lọc tìm kiếm</h3>
        </div>

        {}
        {categories.length > 0 && (
          <FilterSection title="Danh mục sản phẩm">
            {categories.map((cat) => (
              <CheckboxItem
                key={cat.slug}
                label={cat.name}
                checked={selectedCategories.includes(cat.name)}
                onChange={() => setSelectedCategories((prev) => toggleItem(prev, cat.name))}
              />
            ))}
          </FilterSection>
        )}

        {}
        {kichThuocs.length > 0 && (
          <FilterSection title="Kích thước sản phẩm">
            {kichThuocs.map((kt) => (
              <CheckboxItem
                key={kt.name}
                label={kt.name}
                checked={selectedKichThuocs.includes(kt.name)}
                onChange={() => setSelectedKichThuocs((prev) => toggleItem(prev, kt.name))}
              />
            ))}
          </FilterSection>
        )}

        {}
        {mauSacs.length > 0 && (
          <FilterSection title="Màu sắc sản phẩm">
            {mauSacs.map((ms) => (
              <CheckboxItem
                key={ms.name}
                label={ms.name}
                checked={selectedMauSacs.includes(ms.name)}
                onChange={() => setSelectedMauSacs((prev) => toggleItem(prev, ms.name))}
              />
            ))}
          </FilterSection>
        )}

        {}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={applyFilters}
            className="w-full py-2.5 bg-[#f15a24] text-white text-[14px] font-semibold rounded-lg hover:bg-[#d94d1a] transition-colors shadow-sm"
          >
            Lọc sản phẩm
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="w-full py-2.5 bg-white text-gray-600 text-[14px] font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            Xoá lọc
          </button>
        </div>
      </div>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-[13px] font-bold text-[#f15a24] mb-2.5 border-b border-gray-100 pb-2">
        {title}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group text-[13px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-[#0c5c36] focus:ring-[#0c5c36]/30 cursor-pointer accent-[#0c5c36]"
      />
      <span className="text-gray-600 group-hover:text-gray-800 transition-colors select-none">
        {label}
      </span>
    </label>
  );
}
