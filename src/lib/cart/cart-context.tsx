'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { CartItem } from '@/types/cart';
import type { Voucher } from '@/types/voucher';

const STORAGE_KEY = 'bao_bi_duc_trong_cart_v1';
const COUPON_KEY = 'bao_bi_applied_coupon_v1';
const FREE_SHIPPING_THRESHOLD = 500000;
const DEFAULT_SHIPPING_FEE = 30000;

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>, openAlert?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  appliedCoupon: Voucher | null;
  applyCoupon: (voucher: Voucher) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Voucher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initialItems = stored ? JSON.parse(stored) : null;
      const storedCoupon = localStorage.getItem(COUPON_KEY);
      const initialCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;

      queueMicrotask(() => {
        if (!active) return;
        if (Array.isArray(initialItems)) {
          setItems(initialItems);
        }
        if (initialCoupon) {
          setAppliedCoupon(initialCoupon);
        }
        setIsHydrated(true);
      });
    } catch (e) {
      console.warn('[CartContext] Failed to load cart from storage:', e);
      queueMicrotask(() => {
        if (active) {
          setIsHydrated(true);
        }
      });
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_KEY);
      }
    } catch (e) {
      console.warn('[CartContext] Failed to save cart to storage:', e);
    }
  }, [items, appliedCoupon, isHydrated]);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'id'>, openAlert = true) => {
      const uniqueId = `${item.productId}-${item.size || 'default'}-${item.color || 'default'}`;

      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === uniqueId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + item.quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: item.price, // sync price if changed
          };
          return updated;
        }
        return [...prev, { ...item, id: uniqueId }];
      });

      if (openAlert) {
        showToast(`Đã thêm "${item.name}" vào giỏ hàng!`);
      }
    },
    [showToast]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
    },
    [showToast]
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPON_KEY);
    } catch {}
  }, []);

  // Total count of items
  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Subtotal (sum of price * qty)
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Apply voucher validation
  const applyCoupon = useCallback(
    (voucher: Voucher): { success: boolean; message: string } => {
      if (!voucher || !voucher.code) {
        return { success: false, message: 'Mã giảm giá không hợp lệ.' };
      }

      // Check min order value
      if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
        return {
          success: false,
          message: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(voucher.minOrderValue)}đ để dùng mã này.`,
        };
      }

      setAppliedCoupon(voucher);
      showToast(`Đã áp dụng mã giảm giá: ${voucher.code.toUpperCase()}!`);
      return { success: true, message: 'Áp dụng mã giảm giá thành công!' };
    },
    [subtotal, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Đã gỡ mã giảm giá.');
  }, [showToast]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;

    // If minOrderValue not met, coupon becomes inactive
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
      return 0;
    }

    if (appliedCoupon.discountType === 'percentage') {
      const calc = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount) {
        return Math.min(calc, appliedCoupon.maxDiscountAmount);
      }
      return calc;
    }

    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }

    // Shipping discount
    if (appliedCoupon.discountType === 'shipping') {
      return DEFAULT_SHIPPING_FEE;
    }

    return 0;
  }, [appliedCoupon, subtotal]);

  // Calculate shipping fee
  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    if (appliedCoupon?.discountType === 'shipping') return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return DEFAULT_SHIPPING_FEE;
  }, [items.length, appliedCoupon, subtotal]);

  // Final Total
  const finalTotal = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [items.length, subtotal, discountAmount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingFee,
        finalTotal,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
