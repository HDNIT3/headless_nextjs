import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/register-form';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản | Bao Bì Đức Trọng',
  description: 'Đăng ký tài khoản mới để nhận thông tin và xem chi tiết bài viết.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50/80 to-white flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Đang tải biểu mẫu...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
