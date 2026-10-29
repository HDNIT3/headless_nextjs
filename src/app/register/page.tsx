import { Suspense, ViewTransition } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import { RegisterForm } from '@/components/features/auth/register-form';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản | Bao Bì Đức Trọng',
  description: 'Đăng ký tài khoản mới để nhận thông tin và xem chi tiết bài viết.',
};

interface RegisterPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  if (searchParams) {
    await searchParams;
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50/80 to-white flex items-center justify-center py-12 px-4 sm:px-6">
        <Suspense
          fallback={
            <ViewTransition exit="page-fade-out" default="none">
              <div className="text-center py-10 text-gray-500">Đang tải biểu mẫu...</div>
            </ViewTransition>
          }
        >
          <ViewTransition enter="page-fade-in" default="none">
            <RegisterForm />
          </ViewTransition>
        </Suspense>
      </div>
    </PageTransition>
  );
}
