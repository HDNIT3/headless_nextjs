import type { Metadata } from 'next';
import { NotFoundView } from '@/components/common/not-found-view';

export const metadata: Metadata = {
  title: 'Không tìm thấy trang | Bao Bì Đức Trọng',
  description: 'Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.',
};

export default function NotFound() {
  return <NotFoundView />;
}
