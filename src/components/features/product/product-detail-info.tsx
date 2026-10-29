'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContactFeatures } from '@/components/features/contact/contact-features';
import { getProductSpecs } from '@/lib/utils/product';
import { formatVnd } from '@/lib/utils/format';
import { useCart } from '@/lib/cart/cart-context';
import type { ProductDetailNode } from '@/types/product';

interface ProductDetailInfoProps {
  product: ProductDetailNode;
}

function parsePriceToNumber(priceStr?: string | null): number {
  if (!priceStr) return 0;
  const clean = priceStr
    .replace(/&nbsp;/g, '')
    .replace(/[₫đ.,\s]/gi, '')
    .trim();
  const num = parseInt(clean, 10);
  return isNaN(num) ? 0 : num;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const specs = getProductSpecs(product);

  const availableSizes = useMemo(() => {
    if (product.productSizes && product.productSizes.length > 0) {
      return product.productSizes;
    }
    const sizeAttr = product.attributes?.nodes?.find(
      (a) => a.name.toLowerCase().includes('kích thước') || a.name.toLowerCase().includes('size')
    );
    return sizeAttr?.options || [];
  }, [product]);

  const availableColors = useMemo(() => {
    if (product.productColors && product.productColors.length > 0) {
      return product.productColors;
    }
    const colorAttr = product.attributes?.nodes?.find(
      (a) => a.name.toLowerCase().includes('màu sắc') || a.name.toLowerCase().includes('color')
    );
    return colorAttr?.options || [];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes[0] || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const regularPriceNum = parsePriceToNumber(product.regularPrice);
  const salePriceNum = parsePriceToNumber(product.salePrice);
  const currentPriceNum =
    salePriceNum > 0
      ? salePriceNum
      : parsePriceToNumber(product.price) || (regularPriceNum > 0 ? regularPriceNum : 100000);

  const hasDiscount = regularPriceNum > currentPriceNum;
  const discountPercent = hasDiscount
    ? Math.round(((regularPriceNum - currentPriceNum) / regularPriceNum) * 100)
    : 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsAdding(true);

    addItem({
      productId: product.databaseId || 1,
      name: product.name,
      slug: product.slug,
      image: product.image?.sourceUrl,
      price: currentPriceNum,
      regularPrice: regularPriceNum > 0 ? regularPriceNum : undefined,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  const handleBuyNow = () => {
    addItem(
      {
        productId: product.databaseId || 1,
        name: product.name,
        slug: product.slug,
        image: product.image?.sourceUrl,
        price: currentPriceNum,
        regularPrice: regularPriceNum > 0 ? regularPriceNum : undefined,
        quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      },
      false
    );
    router.push('/thanh-toan');
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold uppercase leading-tight tracking-wide text-gray-900">
        {product.name}
      </h1>

      {}
      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-extrabold text-[#0c5c36]">
          {formatVnd(currentPriceNum)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatVnd(regularPriceNum)}
            </span>
            <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-600">
              -{discountPercent}%
            </span>
          </>
        )}
        <span className="text-xs text-gray-500 font-medium">
          (Đã bao gồm thuế & hỗ trợ xuất VAT)
        </span>
      </div>

      <div className="mt-4 border-b border-gray-200" />

      {}
      {availableSizes.length > 0 && (
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Kích thước: <span className="text-gray-900 font-semibold">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#0c5c36] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {availableColors.length > 0 && (
        <div className="mt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Màu sắc: <span className="text-gray-900 font-semibold">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedColor === color
                    ? 'bg-[#0c5c36] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between sm:justify-start border border-gray-200 rounded-xl bg-gray-50/70 p-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow-xs active:scale-95 transition-all cursor-pointer"
            aria-label="Giảm số lượng"
          >
            -
          </button>
          <span className="w-12 text-center font-bold text-gray-900 text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow-xs active:scale-95 transition-all cursor-pointer"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0c5c36] hover:bg-[#09472a] text-white px-5 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
        </button>

        {/* Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f15a24] hover:bg-[#e04c06] text-white px-5 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
        >
          Mua ngay
        </button>
      </div>

      {/* Specs List */}
      {specs.length > 0 && (
        <ul className="mt-6 space-y-2 text-[14px] leading-relaxed text-gray-700 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
          {specs.map((spec) => (
            <li key={spec.label} className="flex items-start gap-2.5">
              <span className="mt-[2px] select-none text-[12px] text-[#0c5c36]">
                ✔
              </span>
              <span>
                <span className="font-semibold text-gray-900">{spec.label}:</span>{' '}
                {spec.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Secondary Quote & Hotline */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/contact"
          className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:border-[#f15a24] hover:text-[#f15a24]"
        >
          Yêu cầu báo giá số lượng lớn
        </Link>

        <a
          href="tel:0986124330"
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-4 py-2 text-[13px] font-semibold text-[#f15a24] transition-colors hover:bg-orange-100"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Hotline tư vấn: 0986 124 330
        </a>
      </div>

      <div className="mt-5 rounded-lg bg-gradient-to-r from-[#fdf3ea] to-[#fbe9d8] px-4 py-4">
        <ContactFeatures />
      </div>
    </div>
  );
}
