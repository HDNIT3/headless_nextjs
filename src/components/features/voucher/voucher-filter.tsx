'use client';

import type { VoucherCategoryType } from '@/types/voucher';

interface TabItem {
  id: VoucherCategoryType;
  label: string;
  icon?: string;
}

const TABS: TabItem[] = [
  { id: 'all', label: 'Tất cả ưu đãi' },
  { id: 'new_customer', label: 'Khách hàng mới' },
  { id: 'percentage', label: 'Giảm theo %' },
  { id: 'shipping', label: 'Miễn phí vận chuyển' },
  { id: 'bulk_order', label: 'Ưu đãi mua sỉ' },
];

interface VoucherFilterProps {
  activeCategory: VoucherCategoryType;
  onSelectCategory: (category: VoucherCategoryType) => void;
  counts: Record<VoucherCategoryType, number>;
  sortBy: 'newest' | 'discount_high' | 'expiring_soon';
  onSortChange: (sort: 'newest' | 'discount_high' | 'expiring_soon') => void;
}

export function VoucherFilter({
  activeCategory,
  onSelectCategory,
  counts,
  sortBy,
  onSortChange,
}: VoucherFilterProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-b border-gray-200">
      {}
      <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#0f5c2e] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Select */}
      <div className="w-full md:w-auto flex items-center justify-end gap-2 text-xs sm:text-sm text-gray-600">
        <span className="font-medium flex-shrink-0">Sắp xếp:</span>
        <select
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as 'newest' | 'discount_high' | 'expiring_soon')
          }
          className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0f5c2e]/40 transition-all cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="discount_high">Giảm giá cao nhất</option>
          <option value="expiring_soon">Sắp hết hạn</option>
        </select>
      </div>
    </div>
  );
}
