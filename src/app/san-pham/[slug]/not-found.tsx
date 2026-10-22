import { NotFoundView } from '@/components/common/not-found-view';

export default function ProductNotFound() {
  return (
    <NotFoundView
      title="Sản phẩm không tồn tại"
      description="Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không còn đúng."
      primaryHref="/san-pham"
      primaryLabel="Xem tất cả sản phẩm"
      secondaryHref="/contact"
      secondaryLabel="Liên hệ báo giá"
    />
  );
}
