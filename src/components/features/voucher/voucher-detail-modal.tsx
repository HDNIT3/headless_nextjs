'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Voucher } from '@/types/voucher';
import { formatVnd, formatDateVi, getRemainingDays } from '@/lib/utils/format';

interface VoucherDetailModalProps {
  voucher: Voucher | null;
  onClose: () => void;
  onCopy: (code: string) => void;
  copiedCode: string | null;
}

export function VoucherDetailModal({
  voucher,
  onClose,
  onCopy,
  copiedCode,
}: VoucherDetailModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (voucher) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [voucher, onClose]);

  if (!voucher) return null;

  const isCopied = copiedCode === voucher.code;
  const remainingDays = getRemainingDays(voucher.endDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {}
      <div className="absolute inset-0" onClick={onClose} aria-hidden />

      {}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-up">
        {}
        <div className="bg-gradient-to-r from-[#0f5c2e] to-[#146b38] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-emerald-100 mb-1">
              {voucher.featuredBadge || 'Ưu Đãi'}
            </span>
            <h3 className="text-lg font-bold">{voucher.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
            <div>
              <div className="text-xs text-gray-500 font-medium">Mã ưu đãi:</div>
              <div className="text-lg font-black tracking-wider text-[#0f5c2e]">
                {voucher.code}
              </div>
            </div>
            <button
              onClick={() => onCopy(voucher.code)}
              className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 ${
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#f15a24] hover:bg-[#e04c06] text-white active:scale-95'
              }`}
            >
              {isCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Đã chép!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Sao chép mã
                </>
              )}
            </button>
          </div>

          {/* Key details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">Đơn tối thiểu:</span>
              <span className="font-semibold text-gray-800">
                {formatVnd(voucher.minOrderValue)}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">Mức giảm:</span>
              <span className="font-semibold text-[#0f5c2e]">
                {voucher.discountType === 'percentage'
                  ? `Giảm ${voucher.discountValue}% ${
                      voucher.maxDiscountAmount
                        ? `(tối đa ${formatVnd(voucher.maxDiscountAmount)})`
                        : ''
                    }`
                  : voucher.discountType === 'shipping'
                  ? `Freeship ${formatVnd(voucher.discountValue)}`
                  : `Giảm ${formatVnd(voucher.discountValue)}`}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">Hiệu lực:</span>
              <span className="font-semibold text-gray-800">
                {voucher.endDate ? `Đến ${formatDateVi(voucher.endDate)}` : 'Không giới hạn thời gian'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">Tình trạng:</span>
              <span
                className={`font-semibold ${
                  !voucher.endDate || remainingDays > 0 ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {!voucher.endDate
                  ? 'Đang áp dụng'
                  : remainingDays > 0
                  ? `Còn ${remainingDays} ngày`
                  : 'Đã hết hạn'}
              </span>
            </div>
          </div>

          {/* Terms & Conditions list */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-2.5">
              Điều kiện &amp; Thể lệ áp dụng:
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              {voucher.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="text-[#0f5c2e] mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Applicable products */}
          {voucher.applicableCategories && voucher.applicableCategories.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500 block mb-1.5">Sản phẩm áp dụng:</span>
              <div className="flex flex-wrap gap-1.5">
                {voucher.applicableCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Đóng
          </button>
          <Link
            href="/san-pham"
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#0f5c2e] hover:bg-[#0c4a24] text-white transition-all shadow-xs flex items-center gap-1.5"
          >
            Mua hàng ngay
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
