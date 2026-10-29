'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { Voucher, VoucherCategoryType } from '@/types/voucher';
import { VoucherHero } from './voucher-hero';
import { VoucherFilter } from './voucher-filter';
import { VoucherCard } from './voucher-card';
import { VoucherDetailModal } from './voucher-detail-modal';
import { VoucherGuide } from './voucher-guide';

interface VoucherPageContentProps {
  initialVouchers: Voucher[];
}

export function VoucherPageContent({ initialVouchers }: VoucherPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<VoucherCategoryType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'discount_high' | 'expiring_soon'>('newest');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyCode = useCallback((code: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    setToastMessage(`Đã sao chép mã "${code}" vào bộ nhớ tạm!`);

    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2500);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<VoucherCategoryType, number> = {
      all: initialVouchers.length,
      new_customer: 0,
      percentage: 0,
      shipping: 0,
      bulk_order: 0,
    };

    initialVouchers.forEach((v) => {
      if (counts[v.category] !== undefined) {
        counts[v.category]++;
      }
    });

    return counts;
  }, [initialVouchers]);

  const filteredVouchers = useMemo(() => {
    let result = [...initialVouchers];

    if (activeCategory !== 'all') {
      result = result.filter((v) => v.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.code.toLowerCase().includes(q) ||
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'discount_high') {
        const valA = a.discountType === 'fixed' ? a.discountValue : a.discountValue * 10000;
        const valB = b.discountType === 'fixed' ? b.discountValue : b.discountValue * 10000;
        return valB - valA;
      }
      if (sortBy === 'expiring_soon') {
        const timeA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
        const timeB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
        return timeA - timeB;
      }
      const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [initialVouchers, activeCategory, searchQuery, sortBy]);

  return (
    <div className="w-full flex flex-col bg-[#fafbfc] min-h-screen">
      {}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f5c2e] text-white px-5 py-3 rounded-xl shadow-xl border border-emerald-400/40 flex items-center gap-2.5 text-sm font-semibold animate-bounce">
          <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {}
      <VoucherHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {}
        <VoucherFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={categoryCounts}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {}
        <div className="mt-6 flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <div>
            Tìm thấy{' '}
            <span className="font-bold text-gray-900">{filteredVouchers.length}</span>{' '}
            mã giảm giá phù hợp
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#0f5c2e] hover:underline font-medium"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          )}
        </div>

        {}
        {filteredVouchers.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onCopy={handleCopyCode}
                onOpenDetail={(v) => setSelectedVoucher(v)}
                isCopied={copiedCode === voucher.code}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0f5c2e] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {initialVouchers.length === 0
                ? 'Chưa có mã giảm giá nào được kích hoạt'
                : 'Không tìm thấy mã ưu đãi phù hợp'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {initialVouchers.length === 0
                ? 'Hệ thống cửa hàng hiện chưa có mã khuyến mãi đang chạy. Quý khách vui lòng liên hệ hotline hoặc xem danh mục sản phẩm để nhận báo giá sỉ tốt nhất.'
                : `Không có mã giảm giá nào khớp với bộ lọc hoặc từ khóa "${searchQuery}". Quý khách vui lòng thử tìm từ khóa khác.`}
            </p>
            {initialVouchers.length > 0 ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#0f5c2e] text-white text-xs sm:text-sm font-semibold hover:bg-[#0c4a24] transition-colors"
              >
                Xem tất cả mã giảm giá
              </button>
            ) : (
              <Link
                href="/san-pham"
                className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-[#0f5c2e] text-white text-xs sm:text-sm font-semibold hover:bg-[#0c4a24] transition-colors"
              >
                Khám phá sản phẩm
              </Link>
            )}
          </div>
        )}

        {}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#0f5c2e] via-[#146b38] to-[#1e824c] p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f15a24] text-white uppercase tracking-wider inline-block mb-3">
              Dành riêng cho đối tác &amp; đại lý
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Cần báo giá đơn hàng sỉ hoặc sản xuất theo yêu cầu?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Chúng tôi cung cấp chính sách chiết khấu trực tiếp tới 25% cho các đơn hàng xuất khẩu, nhà vườn thu mua và hệ thống phân phối nông sản toàn quốc.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white text-[#0f5c2e] hover:bg-emerald-50 font-bold text-sm text-center transition-all shadow-sm"
            >
              Liên hệ nhận báo giá sỉ
            </a>
            <a
              href="tel:0900000000"
              className="px-6 py-3 rounded-xl bg-[#f15a24] hover:bg-[#e04c06] text-white font-bold text-sm text-center transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hotline tư vấn
            </a>
          </div>
        </div>

        {}
        <VoucherGuide />
      </main>

      {}
      <VoucherDetailModal
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        onCopy={handleCopyCode}
        copiedCode={copiedCode}
      />
    </div>
  );
}
