'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/cart-context';
import { createOrderAction } from '@/service/checkout.service';
import { formatVnd } from '@/lib/utils/format';
import { formatMediaUrl } from '@/lib/utils/media';
import type { CheckoutResponse } from '@/types/cart';
import type { UserSession } from '@/lib/auth/session';

interface CheckoutPageContentProps {
  currentUser: UserSession | null;
}

const VIETNAM_CITIES = [
  'Lâm Đồng',
  'TP Hồ Chí Minh',
  'Hà Nội',
  'Đắk Lắk',
  'Đồng Nai',
  'Bình Dương',
  'Tiền Giang',
  'Cần Thơ',
  'Bà Rịa - Vũng Tàu',
  'Bình Thuận',
  'Khánh Hòa',
  'Gia Lai',
  'Bình Phước',
  'Tây Ninh',
  'Vĩnh Long',
  'Bến Tre',
  'Đồng Tháp',
  'An Giang',
  'Kiên Giang',
  'Cà Mau',
  'Hải Phòng',
  'Đà Nẵng',
  'Tỉnh thành khác',
];

export function CheckoutPageContent({ currentUser }: CheckoutPageContentProps) {
  const {
    items,
    clearCart,
    subtotal,
    appliedCoupon,
    discountAmount,
    shippingFee,
    finalTotal,
  } = useCart();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState('Lâm Đồng');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('vietqr');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<CheckoutResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên người nhận.');
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^[0-9]{9,11}$/.test(cleanPhone)) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ giao nhận hàng cụ thể.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với điều khoản mua hàng để tiếp tục.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        billing: {
          fullName: fullName.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          address: address.trim(),
          city,
          note: note.trim() || undefined,
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        paymentMethod,
        couponCode: appliedCoupon?.code,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        shippingFee,
        userId: currentUser?.id,
        customerNote: note.trim() || undefined,
      };

      const res = await createOrderAction(payload);

      if (!res.success) {
        setErrorMessage(res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
        setIsSubmitting(false);
        return;
      }

      clearCart();
      setOrderResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderResult && orderResult.success) {
    const isVietQR = orderResult.payment_method === 'vietqr' && orderResult.vietqr;
    const qr = orderResult.vietqr;

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 sm:p-10 shadow-lg text-center">
          { }
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#0c5c36]">
            <svg
              className="h-10 w-10 animate-in zoom-in-50 duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl sm:text-3xl font-black text-gray-900">
            Đặt hàng thành công!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Cảm ơn bạn đã đặt hàng tại <span className="font-bold text-[#0c5c36]">Bao Bì Đức Trọng</span>.
            Đơn hàng đã được lưu và đang được xử lý trên hệ thống WordPress.
          </p>

          { }
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 px-6 py-3 text-sm">
            <span>
              Mã đơn hàng: <strong className="text-gray-900">#{orderResult.order_number || orderResult.order_id}</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span>
              Tổng thanh toán: <strong className="text-[#0c5c36]">{formatVnd(orderResult.total || 0)}</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span>
              Phương thức: <strong className="text-gray-900">{orderResult.payment_method === 'vietqr' ? 'Chuyển khoản VietQR' : 'COD'}</strong>
            </span>
          </div>

          { }
          {isVietQR && qr && (
            <div className="mt-8 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/70 to-white p-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c5c36] text-white text-xs font-bold">
                  QR
                </span>
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  Quét mã QR thanh toán ngân hàng (VietQR)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                { }
                <div className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                    <Image
                      src={qr.qr_url}
                      alt="VietQR Payment Code"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <span className="mt-2 text-[11px] text-gray-500 font-medium">
                    Mở ứng dụng ngân hàng bất kỳ để quét mã
                  </span>
                </div>

                { }
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-white border border-gray-200">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                      Ngân hàng thụ hưởng
                    </span>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">
                      {qr.bank_name}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                        Số tài khoản
                      </span>
                      <p className="font-mono font-black text-gray-900 text-base mt-0.5">
                        {qr.account_number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyText(qr.account_number, 'stk')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0c5c36] hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedField === 'stk' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                      Tên chủ tài khoản
                    </span>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">
                      {qr.account_name}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                        Nội dung chuyển khoản
                      </span>
                      <p className="font-mono font-bold text-[#f15a24] text-base mt-0.5">
                        {qr.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyText(qr.description, 'nd')}
                      className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#f15a24] hover:bg-orange-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedField === 'nd' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                        Số tiền chính xác
                      </span>
                      <p className="font-bold text-[#0c5c36] text-base mt-0.5">
                        {formatVnd(qr.amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyText(qr.amount.toString(), 'amount')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0c5c36] hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedField === 'amount' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          { }
          <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left text-sm text-gray-700 space-y-1.5">
            <h4 className="font-bold text-gray-900 mb-2">Thông tin nhận hàng:</h4>
            <p>
              • <strong>Người nhận:</strong> {orderResult.customer_name}
            </p>
            <p>
              • <strong>Số điện thoại:</strong> {orderResult.phone}
            </p>
            <p>
              • <strong>Địa chỉ giao:</strong> {orderResult.address}
            </p>
          </div>

          { }
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0c5c36] hover:bg-[#09472a] text-white text-sm font-bold shadow-md transition-all text-center"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              href="/san-pham"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-bold transition-all text-center"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Chưa có sản phẩm nào để thanh toán
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi thực hiện đặt hàng.
        </p>
        <Link
          href="/san-pham"
          className="mt-6 inline-flex rounded-xl bg-[#0c5c36] px-6 py-2.5 text-sm font-bold text-white shadow-xs"
        >
          Chọn sản phẩm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
      { }
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#0c5c36]">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/gio-hang" className="hover:text-[#0c5c36]">
          Giỏ hàng
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Thanh toán</span>
      </nav>

      { }
      <div className="mb-8 max-w-xl mx-auto flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <Link
            href="/gio-hang"
            className="w-8 h-8 rounded-full bg-[#0c5c36] text-white flex items-center justify-center font-bold text-xs"
          >
            ✓
          </Link>
          <span className="text-xs font-semibold text-gray-500 mt-1.5">Giỏ hàng</span>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#0c5c36] text-white flex items-center justify-center font-bold text-xs shadow-md">
            2
          </div>
          <span className="text-xs font-bold text-[#0c5c36] mt-1.5">Thanh toán</span>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <span className="text-xs font-semibold text-gray-500 mt-1.5">Hoàn tất</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          { }
          <div className="lg:col-span-7 space-y-6">
            { }
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900 pb-4 border-b border-gray-100 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#0c5c36] text-xs font-bold">
                  1
                </span>
                Thông tin giao hàng
              </h2>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                { }
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0c5c36] focus:outline-hidden"
                  />
                </div>

                { }
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0986124330"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0c5c36] focus:outline-hidden"
                  />
                </div>

                { }
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email nhận thông báo
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0c5c36] focus:outline-hidden"
                  />
                </div>

                { }
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0c5c36] focus:outline-hidden bg-white"
                  >
                    {VIETNAM_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                { }
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Địa chỉ chi tiết (Số nhà, đường, thôn/xã) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ví dụ: Số 45, Đường 3/4, Phường 3"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-[#0c5c36] focus:outline-hidden"
                  />
                </div>

                { }
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Ghi chú đơn hàng (Thời gian giao, yêu cầu thêm...)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Giao giờ hành chính, gọi trước khi đến..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:border-[#0c5c36] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            { }
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-900 pb-4 border-b border-gray-100 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#0c5c36] text-xs font-bold">
                  2
                </span>
                Phương thức thanh toán
              </h2>

              <div className="mt-5 space-y-3">
                { }
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'vietqr'
                      ? 'border-[#0c5c36] bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vietqr"
                    checked={paymentMethod === 'vietqr'}
                    onChange={() => setPaymentMethod('vietqr')}
                    className="mt-1 h-4 w-4 text-[#0c5c36] focus:ring-[#0c5c36]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        Chuyển khoản ngân hàng quét mã QR (VietQR)
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-[#0c5c36]">
                        Khuyên dùng
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Tự động tạo mã QR chính xác số tiền và nội dung, quét trên 37 ứng dụng ngân hàng và ví điện tử, xử lý ngay lập tức.
                    </p>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod'
                      ? 'border-[#0c5c36] bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 h-4 w-4 text-[#0c5c36] focus:ring-[#0c5c36]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      Thanh toán bằng tiền mặt trực tiếp cho nhân viên vận chuyển sau khi kiểm tra kiện hàng.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-lg">
                  Đơn hàng của bạn
                </h3>
                <Link
                  href="/gio-hang"
                  className="text-xs font-semibold text-[#0c5c36] hover:underline"
                >
                  Sửa giỏ hàng
                </Link>
              </div>

              {/* Items preview list */}
              <ul className="mt-4 divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        {item.image && (
                          <Image src={formatMediaUrl(item.image)} alt={item.name} fill unoptimized className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-gray-400">
                          SL: {item.quantity} {item.size ? `• ${item.size}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 shrink-0">
                      {formatVnd(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Price Breakdown */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính hàng</span>
                  <span className="font-semibold text-gray-900">{formatVnd(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>
                      Giảm giá {appliedCoupon ? `(${appliedCoupon.code.toUpperCase()})` : ''}
                    </span>
                    <span>-{formatVnd(discountAmount)}</span>
                  </div>
                )}

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
                    <span className="text-[11px] text-gray-400">
                      (Lưu trực tiếp vào WooCommerce)
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#0c5c36]">
                    {formatVnd(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600 flex items-center gap-2">
                  <span>⚠</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#0c5c36] focus:ring-[#0c5c36]"
                  />
                  <span>
                    Tôi đồng ý với chính sách bán hàng và bảo mật của Bao Bì Đức Trọng.
                  </span>
                </label>
              </div>

              {/* Place Order Button */}
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl text-white py-3.5 text-sm font-bold shadow-md transition-all ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#0c5c36] hover:bg-[#09472a] hover:shadow-lg active:scale-[0.98] cursor-pointer'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Đang lưu đơn hàng lên WordPress...</span>
                    </>
                  ) : (
                    <>
                      <span>XÁC NHẬN ĐẶT HÀNG</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[11px] text-gray-400">
                  🔒 Dữ liệu được mã hóa và đồng bộ trực tiếp với máy chủ WooCommerce
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
