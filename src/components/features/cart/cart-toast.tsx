'use client';

import { useCart } from '@/lib/cart/cart-context';

export function CartToast() {
  const { toastMessage, dismissToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 rounded-2xl bg-gray-900/95 text-white px-4 py-3 shadow-xl backdrop-blur-md border border-white/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c5c36] text-white">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="flex-1 text-sm font-medium">{toastMessage}</p>
        <button
          onClick={dismissToast}
          className="shrink-0 p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Đóng"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
