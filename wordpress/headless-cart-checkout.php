<?php
/**
 * Plugin Name: Headless Store Cart & Checkout API
 * Description: Cung cấp API xử lý Giỏ hàng, Đặt hàng Checkout và Lưu đơn hàng WooCommerce cho Next.js Headless Store.
 * Version: 1.0.1
 * Author: Antigravity
 */

defined('ABSPATH') or exit;

// Tắt gửi email đồng bộ trong các REST API request để phản hồi tức thì cho frontend headless
add_filter('woocommerce_defer_transactional_emails', function ($defer) {
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return true;
    }
    return $defer;
});

add_action('rest_api_init', function () {
    // 1. Endpoint Tạo đơn hàng (Checkout)
    register_rest_route('headless/v1', '/checkout', [
        'methods'             => 'POST',
        'callback'            => 'headless_store_handle_checkout',
        'permission_callback' => '__return_true',
    ]);

    // 2. Endpoint Lấy danh sách đơn hàng của User
    register_rest_route('headless/v1', '/orders', [
        'methods'             => 'GET',
        'callback'            => 'headless_store_get_user_orders',
        'permission_callback' => '__return_true',
    ]);

    // 3. Endpoint Lấy cấu hình thanh toán & VietQR
    register_rest_route('headless/v1', '/store-config', [
        'methods'             => 'GET',
        'callback'            => 'headless_store_get_config',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Lấy cấu hình thanh toán & ngân hàng
 */
function headless_store_get_config() {
    $vietqr_options = get_option('woocommerce_vietqr_settings', []);
    $bank_id = !empty($vietqr_options['bank_id']) ? $vietqr_options['bank_id'] : 'MB';
    $bank_name = !empty($vietqr_options['bank_name']) ? $vietqr_options['bank_name'] : 'MB Bank (Quân Đội)';
    $account_number = !empty($vietqr_options['account_number']) ? $vietqr_options['account_number'] : '0986124330';
    $account_name = !empty($vietqr_options['account_name']) ? $vietqr_options['account_name'] : 'BAO BI DUC TRONG';

    return new WP_REST_Response([
        'success' => true,
        'payment_methods' => [
            [
                'id' => 'cod',
                'title' => 'Thanh toán khi nhận hàng (COD)',
                'description' => 'Thanh toán tiền mặt trực tiếp cho nhân viên giao hàng sau khi nhận và kiểm tra kiện hàng.',
                'enabled' => true,
            ],
            [
                'id' => 'vietqr',
                'title' => 'Chuyển khoản quét mã QR (VietQR)',
                'description' => 'Chuyển khoản nhanh 24/7 qua mã VietQR tương thích tất cả ứng dụng ngân hàng và ví điện tử.',
                'enabled' => true,
                'bank_info' => [
                    'bank_id' => $bank_id,
                    'bank_name' => $bank_name,
                    'account_number' => $account_number,
                    'account_name' => $account_name,
                ]
            ],
        ],
        'shipping' => [
            'free_shipping_threshold' => 500000,
            'default_shipping_fee' => 30000,
        ]
    ], 200);
}

/**
 * Xử lý tạo đơn hàng WooCommerce và lưu vào database
 */
function headless_store_handle_checkout(WP_REST_Request $request) {
    if (!class_exists('WooCommerce')) {
        return new WP_Error('wc_missing', 'WooCommerce chưa được kích hoạt trên hệ thống.', ['status' => 500]);
    }

    $params = $request->get_json_params();
    if (empty($params)) {
        $params = $request->get_params();
    }

    $billing = $params['billing'] ?? [];
    $items = $params['items'] ?? [];
    $payment_method = sanitize_text_field($params['paymentMethod'] ?? 'cod');
    $coupon_code = sanitize_text_field($params['couponCode'] ?? '');
    $shipping_fee = floatval($params['shippingFee'] ?? 0);
    $user_id = !empty($params['userId']) ? intval($params['userId']) : 0;
    $customer_note = sanitize_textarea_field($params['customerNote'] ?? ($billing['note'] ?? ''));

    // Validation cơ bản
    if (empty($items) || !is_array($items)) {
        return new WP_Error('empty_cart', 'Giỏ hàng của bạn đang trống.', ['status' => 400]);
    }

    $first_name = sanitize_text_field($billing['fullName'] ?? ($billing['firstName'] ?? 'Khách hàng'));
    $phone = sanitize_text_field($billing['phone'] ?? '');
    $email = sanitize_email($billing['email'] ?? '');
    $address = sanitize_text_field($billing['address'] ?? '');
    $city = sanitize_text_field($billing['city'] ?? '');
    $district = sanitize_text_field($billing['district'] ?? '');
    $ward = sanitize_text_field($billing['ward'] ?? '');

    if (empty($phone)) {
        return new WP_Error('missing_phone', 'Vui lòng cung cấp số điện thoại nhận hàng.', ['status' => 400]);
    }

    $full_address = trim($address . (!empty($ward) ? ', ' . $ward : '') . (!empty($district) ? ', ' . $district : '') . (!empty($city) ? ', ' . $city : ''));

    try {
        // Tạm hoãn hook email để phản hồi tức thì
        remove_action('woocommerce_order_status_pending_to_processing_notification', ['WC_Emails', 'send_transactional_email']);
        remove_action('woocommerce_order_status_pending_to_on-hold_notification', ['WC_Emails', 'send_transactional_email']);

        // 1. Khởi tạo đơn hàng WooCommerce
        $order = wc_create_order();
        if (is_wp_error($order)) {
            return $order;
        }

        // 2. Thêm từng sản phẩm vào đơn hàng
        foreach ($items as $item) {
            $product_id = intval($item['productId'] ?? 0);
            $quantity = max(1, intval($item['quantity'] ?? 1));
            $custom_price = isset($item['price']) ? floatval($item['price']) : null;
            $size = sanitize_text_field($item['size'] ?? '');
            $color = sanitize_text_field($item['color'] ?? '');

            $product = wc_get_product($product_id);
            if (!$product) {
                // Nếu không tìm thấy product trong WC, dùng generic line item
                $item_name = sanitize_text_field($item['name'] ?? 'Sản phẩm bao bì');
                $item_id = $order->add_product(null, $quantity, [
                    'name' => $item_name,
                    'subtotal' => ($custom_price ?: 100000) * $quantity,
                    'total' => ($custom_price ?: 100000) * $quantity,
                ]);
            } else {
                $args = [];
                if ($custom_price !== null && $custom_price > 0) {
                    $args['subtotal'] = $custom_price * $quantity;
                    $args['total'] = $custom_price * $quantity;
                }
                $item_id = $order->add_product($product, $quantity, $args);
            }

            if ($item_id && is_numeric($item_id)) {
                $order_item = $order->get_item($item_id);
                if ($order_item) {
                    if (!empty($size)) {
                        $order_item->add_meta_data('Kích thước', $size, true);
                    }
                    if (!empty($color)) {
                        $order_item->add_meta_data('Màu sắc', $color, true);
                    }
                    if ($custom_price !== null && $custom_price > 0) {
                        $order_item->set_subtotal($custom_price * $quantity);
                        $order_item->set_total($custom_price * $quantity);
                    }
                    $order_item->save();
                }
            }
        }

        // 3. Thêm mã giảm giá nếu có
        if (!empty($coupon_code)) {
            $coupon_res = $order->apply_coupon($coupon_code);
            // Nếu WC coupon fail nhưng frontend có số tiền giảm, có thể thêm fee âm
            if (is_wp_error($coupon_res) && !empty($params['discountAmount'])) {
                $discount_val = floatval($params['discountAmount']);
                if ($discount_val > 0) {
                    $fee = new WC_Order_Item_Fee();
                    $fee->set_name('Giảm giá (Mã ' . strtoupper($coupon_code) . ')');
                    $fee->set_amount(-$discount_val);
                    $fee->set_total(-$discount_val);
                    $order->add_item($fee);
                }
            }
        } elseif (!empty($params['discountAmount'])) {
            $discount_val = floatval($params['discountAmount']);
            if ($discount_val > 0) {
                $fee = new WC_Order_Item_Fee();
                $fee->set_name('Khuyến mãi giảm giá');
                $fee->set_amount(-$discount_val);
                $fee->set_total(-$discount_val);
                $order->add_item($fee);
            }
        }

        // 4. Thêm phí giao hàng
        if ($shipping_fee > 0) {
            $shipping_item = new WC_Order_Item_Shipping();
            $shipping_item->set_method_title('Giao hàng tận nơi');
            $shipping_item->set_method_id('flat_rate');
            $shipping_item->set_total($shipping_fee);
            $order->add_item($shipping_item);
        }

        // 5. Cập nhật thông tin giao hàng & khách hàng
        $address_data = [
            'first_name' => $first_name,
            'last_name'  => '',
            'company'    => '',
            'email'      => $email,
            'phone'      => $phone,
            'address_1'  => $full_address ?: $address,
            'city'       => $city ?: 'Hồ Chí Minh',
            'state'      => $city ?: 'Hồ Chí Minh',
            'postcode'   => '700000',
            'country'    => 'VN',
        ];

        $order->set_address($address_data, 'billing');
        $order->set_address($address_data, 'shipping');

        // Gán customer ID nếu đã đăng nhập
        if ($user_id > 0) {
            $order->set_customer_id($user_id);
        }

        // Gán phương thức thanh toán
        if ($payment_method === 'vietqr') {
            $order->set_payment_method('vietqr');
            $order->set_payment_method_title('Chuyển khoản quét mã QR (VietQR)');
        } else {
            $order->set_payment_method('cod');
            $order->set_payment_method_title('Thanh toán khi nhận hàng (COD)');
        }

        // Ghi chú đơn hàng
        if (!empty($customer_note)) {
            $order->set_customer_note($customer_note);
        }

        // 6. Tính toán lại tổng tiền
        $order->calculate_totals(false);

        // Đặt trạng thái ban đầu
        if ($payment_method === 'vietqr') {
            $order->update_status('on-hold', 'Đơn hàng mới tạo qua Next.js Headless Store (Chờ chuyển khoản VietQR).');
        } else {
            $order->update_status('processing', 'Đơn hàng mới tạo qua Next.js Headless Store (COD - Giao hàng thu tiền).');
        }

        // Lưu đơn hàng vào Database
        $order_id = $order->save();
        $order_number = $order->get_order_number();
        $total = $order->get_total();

        // 7. Tạo thông tin VietQR nếu chọn thanh toán VietQR
        $vietqr_data = null;
        if ($payment_method === 'vietqr') {
            $config = headless_store_get_config()->get_data();
            $bank_info = $config['payment_methods'][1]['bank_info'] ?? [
                'bank_id' => 'MB',
                'account_number' => '0986124330',
                'account_name' => 'BAO BI DUC TRONG',
                'bank_name' => 'MB Bank (Quân Đội)',
            ];

            $qr_bank = $bank_info['bank_id'];
            $qr_acc = $bank_info['account_number'];
            $qr_name = rawurlencode($bank_info['account_name']);
            $qr_amount = intval($total);
            $qr_desc = 'BAOBI' . $order_id;

            $qr_url = "https://img.vietqr.io/image/{$qr_bank}-{$qr_acc}-compact2.jpg?amount={$qr_amount}&addInfo={$qr_desc}&accountName={$qr_name}";

            $vietqr_data = [
                'qr_url'         => $qr_url,
                'bank_id'        => $qr_bank,
                'bank_name'      => $bank_info['bank_name'],
                'account_number' => $qr_acc,
                'account_name'   => $bank_info['account_name'],
                'amount'         => $qr_amount,
                'description'    => $qr_desc,
            ];
        }

        return new WP_REST_Response([
            'success'        => true,
            'message'        => 'Đơn hàng đã được lưu thành công trên hệ thống WordPress.',
            'order_id'       => $order_id,
            'order_number'   => $order_number,
            'total'          => floatval($total),
            'currency'       => 'VND',
            'status'         => $order->get_status(),
            'payment_method' => $payment_method,
            'customer_name'  => $first_name,
            'phone'          => $phone,
            'address'        => $full_address,
            'vietqr'         => $vietqr_data,
        ], 200);

    } catch (Exception $e) {
        return new WP_Error('order_creation_failed', 'Không thể tạo đơn hàng: ' . $e->getMessage(), ['status' => 500]);
    }
}

/**
 * Lấy danh sách đơn hàng của một người dùng theo User ID
 */
function headless_store_get_user_orders(WP_REST_Request $request) {
    if (!class_exists('WooCommerce')) {
        return new WP_Error('wc_missing', 'WooCommerce chưa được kích hoạt.', ['status' => 500]);
    }

    $user_id = intval($request->get_param('userId'));
    if ($user_id <= 0) {
        return new WP_Error('invalid_user', 'Vui lòng cung cấp User ID hợp lệ.', ['status' => 400]);
    }

    $orders = wc_get_orders([
        'customer_id' => $user_id,
        'limit'       => 20,
        'orderby'     => 'date',
        'order'       => 'DESC',
    ]);

    $data = [];
    foreach ($orders as $order) {
        $items = [];
        foreach ($order->get_items() as $item) {
            $items[] = [
                'id'       => $item->get_id(),
                'name'     => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'total'    => floatval($item->get_total()),
                'size'     => $item->get_meta('Kích thước') ?: '',
                'color'    => $item->get_meta('Màu sắc') ?: '',
            ];
        }

        $status_map = [
            'pending'    => 'Chờ thanh toán',
            'processing' => 'Đang xử lý',
            'on-hold'    => 'Tạm giữ (Chờ chuyển khoản)',
            'completed'  => 'Hoàn thành',
            'cancelled'  => 'Đã hủy',
            'refunded'   => 'Đã hoàn tiền',
            'failed'     => 'Thất bại',
        ];

        $data[] = [
            'order_id'       => $order->get_id(),
            'order_number'   => $order->get_order_number(),
            'status'         => $order->get_status(),
            'status_label'   => $status_map[$order->get_status()] ?? $order->get_status(),
            'total'          => floatval($order->get_total()),
            'payment_method' => $order->get_payment_method_title(),
            'date_created'   => $order->get_date_created() ? $order->get_date_created()->date('d/m/Y H:i') : '',
            'items'          => $items,
        ];
    }

    return new WP_REST_Response([
        'success' => true,
        'orders'  => $data,
    ], 200);
}
