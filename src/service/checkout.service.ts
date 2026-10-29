'use server';

import type {
  CheckoutPayload,
  CheckoutResponse,
  UserOrder,
  UserOrdersResponse,
} from '@/types/cart';

function getWordPressBaseUrl(): string {
  if (process.env.WORDPRESS_URL) {
    return process.env.WORDPRESS_URL.replace(/\/+$/, '');
  }

  const wpGraphqlUrl =
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    'http://localhost/prj/graphql';

  return wpGraphqlUrl.replace(/\/graphql\/?$/i, '').replace(/\/+$/, '');
}

export async function createOrderAction(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  try {
    const baseUrl = getWordPressBaseUrl();
    const endpoint = `${baseUrl}/wp-json/headless/v1/checkout`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = (await res.json()) as CheckoutResponse & {
      code?: string;
      message?: string;
    };

    if (!res.ok || !data.success) {
      return {
        success: false,
        message:
          data.message ||
          'Không thể xử lý đơn hàng tại WordPress. Vui lòng thử lại.',
      };
    }

    return data;
  } catch (error) {
    console.error('[CheckoutService] Failed to create order:', error);
    return {
      success: false,
      message: 'Lỗi kết nối máy chủ WordPress. Vui lòng kiểm tra kết nối mạng.',
    };
  }
}

export async function getUserOrdersAction(
  userId: number
): Promise<UserOrder[]> {
  if (!userId || userId <= 0) return [];

  try {
    const baseUrl = getWordPressBaseUrl();
    const endpoint = `${baseUrl}/wp-json/headless/v1/orders?userId=${userId}`;

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as UserOrdersResponse;
    return data.success && Array.isArray(data.orders) ? data.orders : [];
  } catch (error) {
    console.error('[CheckoutService] Failed to fetch user orders:', error);
    return [];
  }
}
