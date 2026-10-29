'use client';

import Link from 'next/link';
import type { Voucher } from '@/types/voucher';
import { formatVnd, formatDateVi, getRemainingDays } from '@/lib/utils/format';

interface VoucherCardProps {
  voucher: Voucher;
  onCopy: (code: string) => void;
  onOpenDetail: (voucher: Voucher) => void;
  isCopied: boolean;
}

export function VoucherCard({
  voucher,
  onCopy,
  onOpenDetail,
  isCopied,
}: VoucherCardProps) {
  const hasExpiry = Boolean(voucher.endDate);
  const remainingDays = getRemainingDays(voucher.endDate);
  const isExpiringSoon = hasExpiry && remainingDays > 0 && remainingDays <= 5;
  const isExpired = hasExpiry && remainingDays <= 0;

  const usagePercent =
    voucher.usageLimit && voucher.usedCount
      ? Math.min(Math.round((voucher.usedCount / voucher.usageLimit) * 100), 100)
      : null;

  const isShipping = voucher.discountType === 'shipping';
  const isFixed = voucher.discountType === 'fixed';
  const isPercentage = voucher.discountType === 'percentage';

  const badgeColor = isShipping
    ? 'bg-amber-500 text-white'
    : isFixed
    ? 'bg-[#f15a24] text-white'
    : 'bg-[#0f5c2e] text-white';

  return (
    <div
      className={`group relative flex flex-col md:flex-row bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ${
        isExpired ? 'opacity-60 grayscale-[40%]' : ''
      }`}
    >
      {/* Hot badge or category badge on top left */}
      {voucher.featuredBadge && (
        <div
          className={`absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs ${badgeColor}`}
        >
          {voucher.featuredBadge}
        </div>
      )}

      {/* LEFT SECTION: Ticket Stub / Value Display */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-7 md:w-[190px] bg-gradient-to-br from-emerald-50/70 via-emerald-100/40 to-slate-50 border-b md:border-b-0 md:border-r border-dashed border-gray-200 text-center flex-shrink-0">
        {/* Ticket Notch Cutouts (desktop: top & bottom of dividing line) */}
        <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#fafbfc] border border-gray-100 shadow-inner pointer-events-none" />
        <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#fafbfc] border border-gray-100 shadow-inner pointer-events-none" />

        {/* Voucher Value */}
        <div className="mt-2 text-center">
          {isPercentage && (
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0f5c2e] tracking-tight">
                {voucher.discountValue}%
              </span>
              <span className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mt-0.5">
                GIẢM GIÁ
              </span>
            </div>
          )}

          {isFixed && (
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#f15a24] tracking-tight">
                {voucher.discountValue >= 1000000
                  ? `${voucher.discountValue / 1000000}Tr`
                  : `${voucher.discountValue / 1000}K`}
              </span>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-700 mt-0.5">
                TIỀN MẶT
              </span>
            </div>
          )}

          {isShipping && (
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight uppercase">
                FREESHIP
              </div>
              <span className="block text-xs font-bold text-amber-800 mt-0.5">
                {formatVnd(voucher.discountValue)}
              </span>
            </div>
          )}
        </div>

        {/* Min spend summary */}
        <div className="mt-3 px-2 py-1 rounded-md bg-white/90 border border-emerald-200/50 text-[11px] font-medium text-gray-600">
          Đơn từ {formatVnd(voucher.minOrderValue)}
        </div>
      </div>

      {/* RIGHT SECTION: Details & Action */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Top row: Code & Title */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0f5c2e] transition-colors line-clamp-1">
                {voucher.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {voucher.description}
              </p>
            </div>
          </div>

          {/* Quick Conditions / Expiry info */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>HSD: {hasExpiry ? formatDateVi(voucher.endDate) : 'Không thời hạn'}</span>
            </div>

            {isExpiringSoon && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 border border-red-200 animate-pulse">
                Sắp hết hạn ({remainingDays} ngày)
              </span>
            )}

            <button
              onClick={() => onOpenDetail(voucher)}
              className="text-[#0f5c2e] hover:underline font-medium hover:text-[#0c4a24] inline-flex items-center gap-0.5 text-xs transition-colors"
            >
              Điều kiện
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Usage progress bar if available */}
          {usagePercent !== null && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                <span>Đã dùng {usagePercent}%</span>
                <span>{usagePercent > 80 ? 'Số lượng có hạn!' : 'Còn lượt dùng'}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercent > 80 ? 'bg-red-500' : 'bg-[#0f5c2e]'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom row: Code box & Actions */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Coupon Code Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">Mã:</span>
            <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-dashed border-gray-300 font-mono font-bold text-sm tracking-wide text-gray-800 select-all">
              {voucher.code}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={() => onCopy(voucher.code)}
              disabled={isExpired}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-[#0f5c2e] hover:bg-emerald-100 border border-emerald-200 active:scale-95'
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

            {/* Use Now link */}
            <Link
              href="/san-pham"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#f15a24] hover:bg-[#e04c06] text-white transition-all duration-200 shadow-xs flex items-center gap-1 active:scale-95"
            >
              Dùng ngay
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
