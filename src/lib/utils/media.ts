/**
 * Tiện ích xử lý và chuẩn hóa URI hình ảnh cho Next.js Headless WordPress.
 */

/**
 * Chuyển đổi URL ảnh từ WordPress backend thành Frontend URI theo cấu hình:
 * Ví dụ:
 * - "http://localhost/prj/wp-content/uploads/2026/09/image-20.png"
 *   -> "/san-pham/wp-upload/2026/09/image-20.png"
 * 
 * Khi người dùng chuột phải chọn "Copy image address" (Sao chép địa chỉ hình ảnh),
 * link nhận được sẽ là:
 * "http://localhost:3000/san-pham/wp-upload/2026/09/image-20.png" (hoặc https://...)
 */
export function formatMediaUrl(url?: string | null): string {
  if (!url) return '';

  // Giữ nguyên nếu đã là đường dẫn của FE hoặc data URI, blob
  if (
    url.startsWith('/san-pham/wp-upload/') ||
    url.startsWith('/wp-content/') ||
    url.startsWith('/images/') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // Khớp đoạn /wp-content/uploads/... từ backend WordPress và chuyển thành /san-pham/wp-upload/...
  const wpUploadMatch = url.match(/\/wp-content\/uploads\/(.+)$/i);
  if (wpUploadMatch) {
    return `/san-pham/wp-upload/${wpUploadMatch[1]}`;
  }

  // Khớp các file media khác trong /wp-content/ (nếu có)
  const wpContentMatch = url.match(/\/wp-content\/(.+)$/i);
  if (wpContentMatch) {
    return `/wp-content/${wpContentMatch[1]}`;
  }

  return url;
}

/**
 * Quét chuỗi HTML (nội dung bài viết, mô tả sản phẩm...) và thay thế toàn bộ
 * URL ảnh của backend WordPress thành Frontend URI (/san-pham/wp-upload/...).
 */
export function replaceMediaUrlsInHtml(html?: string | null): string {
  if (!html) return '';

  // Thay thế URL /wp-content/uploads/ thành /san-pham/wp-upload/
  let result = html.replace(
    /https?:\/\/[^\s"'<>,]+?\/wp-content\/uploads\/([^\s"'<>,]+)/gi,
    '/san-pham/wp-upload/$1'
  );

  // Thay thế các đường dẫn /wp-content/ còn lại
  result = result.replace(
    /https?:\/\/[^\s"'<>,]+?(\/wp-content\/[^\s"'<>,]+)/gi,
    '$1'
  );

  return result;
}
