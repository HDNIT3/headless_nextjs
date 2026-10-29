import { Suspense, ViewTransition } from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '@/components/common/page-transition';
import { LoginForm } from '@/components/features/auth/login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập | Bao Bì Đức Trọng',
  description: 'Đăng nhập tài khoản để xem chi tiết bài viết và kiến thức chuyên sâu.',
};

interface LoginPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (searchParams) {
    await searchParams;
  }

  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-80px)] bg-slate-50/60 flex items-center justify-center py-12 px-4 sm:px-6 overflow-hidden">
        {}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(15, 92, 46, 0.12) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#0f5c2e]/15 blur-3xl pointer-events-none" />

        {}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#f26522]/15 blur-3xl pointer-events-none" />

        {}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full flex justify-center">
          <Suspense
            fallback={
              <ViewTransition exit="page-fade-out" default="none">
                <div className="text-center py-10 text-gray-500">Đang tải biểu mẫu...</div>
              </ViewTransition>
            }
          >
            <ViewTransition enter="page-fade-in" default="none">
              <LoginForm />
            </ViewTransition>
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
}
