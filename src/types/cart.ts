export interface CartItem {
  id: string; 
  productId: number;
  name: string;
  slug: string;
  image?: string;
  price: number;
  regularPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderBilling {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
}

export interface VietQRData {
  qr_url: string;
  bank_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  amount: number;
  description: string;
}

export interface CheckoutPayload {
  billing: OrderBilling;
  items: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  paymentMethod: 'cod' | 'vietqr';
  couponCode?: string;
  discountAmount?: number;
  shippingFee?: number;
  userId?: number;
  customerNote?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  order_id?: number;
  order_number?: string;
  total?: number;
  currency?: string;
  status?: string;
  payment_method?: string;
  customer_name?: string;
  phone?: string;
  address?: string;
  vietqr?: VietQRData | null;
}

export interface UserOrder {
  order_id: number;
  order_number: string;
  status: string;
  status_label: string;
  total: number;
  payment_method: string;
  date_created: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    total: number;
    size?: string;
    color?: string;
  }[];
}

export interface UserOrdersResponse {
  success: boolean;
  orders: UserOrder[];
}
