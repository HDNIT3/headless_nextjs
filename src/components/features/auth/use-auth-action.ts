'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/service/auth.service';

interface UseAuthActionOptions {
  /** Thông báo dự phòng khi action thất bại mà không trả về message. */
  fallbackMessage: string;
  /**
   * Nơi nhận thông báo lỗi. Bỏ trống thì hook tự giữ lỗi trong state nội bộ
   * (dùng cho form); truyền vào khi component cha cần hiển thị lỗi thay
   * (dùng cho các nút đăng nhập social).
   */
  onError?: (message: string) => void;
}

/**
 * Gom logic lặp lại của các luồng xác thực phía client:
 * quản lý `loading`, hiển thị lỗi, refresh dữ liệu server và điều hướng sau khi thành công.
 */
export function useAuthAction({ fallbackMessage, onError }: UseAuthActionOptions) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const report = useCallback(
    (message: string) => {
      if (onError) onError(message);
      else setError(message);
    },
    [onError]
  );

  const submit = useCallback(
    async (action: () => Promise<ActionResult>) => {
      if (!onError) setError(null);
      setLoading(true);

      try {
        const result = await action();

        if (!result.success) {
          report(result.message || fallbackMessage);
          setLoading(false);
          return;
        }

        // Cập nhật lại dữ liệu server (Header...) trước khi điều hướng
        router.refresh();
        router.push(result.redirectTo);
      } catch (err: unknown) {
        report(err instanceof Error ? err.message : fallbackMessage);
        setLoading(false);
      }
    },
    [fallbackMessage, onError, report, router]
  );

  return { loading, setLoading, error, setError, submit };
}
