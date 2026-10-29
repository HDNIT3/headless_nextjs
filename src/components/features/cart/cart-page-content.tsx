'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/cart-context';
import { formatVnd } from '@/lib/utils/format';
import { formatMediaUrl } from '@/lib/utils/media';
import type { Voucher } from '@/types/voucher';

interface CartPageContentProps {
  availableVouchers: Voucher[];
}

const FREE_SHIPPING_THRESHOLD = 500000;

export function CartPageContent({ availableVouchers }: CartPageContentProps) {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingFee,
    finalTotal,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const handleApplyCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!inputCode.trim()) return;

    const matched = availableVouchers.find(
      (v) => v.code.toLowerCase() === inputCode.trim().toLowerCase()
    );

    if (matched) {
      const res = applyCoupon(matched);
      if (!res.success) {
        setCouponError(res.message);
      } else {
        setInputCode('');
      }
    } else {
      setCouponError('Mã giảm giá không tồn tại hoặc đã hết hạn.');
    }
  };

  const handleSelectVoucher = (v: Voucher) => {
    const res = applyCoupon(v);
    if (res.success) {
      setShowVoucherModal(false);
      setCouponError(null);
    } else {
      setCouponError(res.message);
    }
  };

  const remainingForFreeship = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeshipProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-[#0c5c36]">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Hãy khám phá các giải pháp thùng xốp và bao bì đóng gói nông sản chất lượng cao tại Bao Bì Đức Trọng.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0c5c36] hover:bg-[#09472a] px-6 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-95"
          >
            Khám phá sản phẩm ngay
            <svg
              className="w-4 h-4"
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
          <Link
            href="/ma-giam-gia"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 hover:border-[#f15a24] hover:text-[#f15a24] px-6 py-3 text-sm font-bold text-gray-700 transition-all"
          >
            Săn mã giảm giá
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
      {}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#0c5c36]">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Giỏ hàng ({items.length})</span>
      </nav>

      {}
      <div className="mb-8 max-w-xl mx-auto flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#0c5c36] text-white flex items-center justify-center font-bold text-xs shadow-md">
            1
          </div>
          <span className="text-xs font-bold text-[#0c5c36] mt-1.5">Giỏ hàng</span>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <span className="text-xs font-semibold text-gray-500 mt-1.5">Thanh toán</span>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <span className="text-xs font-semibold text-gray-500 mt-1.5">Hoàn tất</span>
        </div>
      </div>

      {}
      <div className="mb-8 rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0c5c36] mb-2">
          <span>
            {remainingForFreeship === 0
              ? '🎉 Bạn đã đủ điều kiện được MIỄN PHÍ VẬN CHUYỂN toàn quốc!'
              : `Mua thêm ${formatVnd(remainingForFreeship)} để được Miễn phí vận chuyển toàn quốc!`}
          </span>
          <span>{freeshipProgress}%</span>
        </div>
        <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#0c5c36] h-2 rounded-full transition-all duration-500"
            style={{ width: `${freeshipProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="font-bold text-gray-900 text-base">
                Danh sách sản phẩm ({items.length})
              </span>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                Xóa tất cả
              </button>
            </div>

            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/40"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {item.image ? (
                        <Image
                          src={formatMediaUrl(item.image)}
                          alt={item.name}
                          fill
                          sizes="80px"
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                          Bao bì
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/san-pham/${item.slug}`}
                        className="font-bold text-gray-900 hover:text-[#0c5c36] text-sm sm:text-base line-clamp-2 transition-colors"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                        {item.size && (
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                            Màu: {item.color}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-[#0c5c36] sm:hidden">
                        {formatVnd(item.price)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/80 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-100 shadow-xs text-xs font-bold active:scale-95 transition-all cursor-pointer"
                        aria-label="Giảm"
                      >
                        -
                      </button>
                      <span className="w-9 text-center font-bold text-gray-900 text-xs sm:text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-100 shadow-xs text-xs font-bold active:scale-95 transition-all cursor-pointer"
                        aria-label="Tăng"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-[90px]">
                      <div className="font-extrabold text-[#0c5c36] text-sm sm:text-base">
                        {formatVnd(item.price * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[11px] text-gray-400">
                          {formatVnd(item.price)} / cái
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0c5c36] hover:underline"
            >
              ← Tiếp tục chọn mua sản phẩm khác
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <h3 className="font-extrabold text-gray-900 text-lg pb-4 border-b border-gray-100">
              Tóm tắt đơn hàng
            </h3>

            {/* Subtotal */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính hàng ({items.reduce((acc, i) => acc + i.quantity, 0)} sản phẩm)</span>
                <span className="font-semibold text-gray-900">{formatVnd(subtotal)}</span>
              </div>

              {/* Discount */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Mã ưu đãi giảm</span>
                  <span>-{formatVnd(discountAmount)}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-[#0c5c36] font-bold">Miễn phí</span>
                  ) : (
                    formatVnd(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <div>
                  <span className="block font-bold text-gray-900 text-base">Tổng thanh toán</span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    (Đã bao gồm VAT & các chi phí)
                  </span>
                </div>
                <span className="text-2xl font-black text-[#0c5c36]">
                  {formatVnd(finalTotal)}
                </span>
              </div>
            </div>

            {/* Voucher Section */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Mã giảm giá / Voucher
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0c5c36] text-white text-[10px] font-bold">
                      %
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-[#0c5c36] uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-gray-600">
                        Giảm {formatVnd(discountAmount)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Gỡ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCustomCode} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Nhập mã ưu đãi..."
                    className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs uppercase font-semibold text-gray-900 placeholder:normal-case placeholder:font-normal focus:border-[#0c5c36] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 hover:bg-black px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </form>
              )}

              {couponError && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {couponError}
                </p>
              )}

              {/* Open available vouchers modal button */}
              {availableVouchers.length > 0 && !appliedCoupon && (
                <button
                  type="button"
                  onClick={() => setShowVoucherModal(true)}
                  className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#0c5c36] hover:underline cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Chọn voucher ưu đãi có sẵn ({availableVouchers.length} mã)
                </button>
              )}
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/thanh-toan')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f15a24] hover:bg-[#e04c06] text-white py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Tiến hành thanh toán
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* Trust Points */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-[12px] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-[#0c5c36] font-bold">✔</span>
                <span>Kiểm tra hàng trước khi thanh toán</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0c5c36] font-bold">✔</span>
                <span>Hỗ trợ xuất hóa đơn VAT theo yêu cầu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0c5c36] font-bold">✔</span>
                <span>Đổi trả miễn phí trong 7 ngày nếu lỗi sản xuất</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Selector Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Mã giảm giá từ Bao Bì Đức Trọng
              </h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {availableVouchers.map((voucher) => {
                const canUse = !voucher.minOrderValue || subtotal >= voucher.minOrderValue;
                return (
                  <div
                    key={voucher.id || voucher.code}
                    className={`rounded-2xl border p-4 transition-all ${
                      canUse
                        ? 'border-emerald-200 bg-white hover:border-[#0c5c36]'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#0c5c36] text-sm uppercase tracking-wide">
                            {voucher.code}
                          </span>
                          {voucher.featuredBadge && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-[#0c5c36]">
                              {voucher.featuredBadge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                          {voucher.title}
                        </p>
                        {voucher.minOrderValue && voucher.minOrderValue > 0 && (
                          <p className="mt-1 text-[11px] text-gray-500">
                            Đơn tối thiểu: {formatVnd(voucher.minOrderValue)}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectVoucher(voucher)}
                        disabled={!canUse}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                          canUse
                            ? 'bg-[#0c5c36] hover:bg-[#09472a] text-white shadow-xs'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canUse ? 'Áp dụng' : 'Chưa đủ ĐK'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
