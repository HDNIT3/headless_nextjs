'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerAction } from '@/service/auth.service';
import { GoogleLoginButton } from './google-login-button';
import { FacebookLoginButton } from './facebook-login-button';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('redirect', redirectUrl);

    try {
      const result = await registerAction(formData);

      if (!result.success) {
        setError(result.message || 'Đăng ký không thành công.');
        setLoading(false);
        return;
      }

      // Đăng ký thành công, tự động chuyển về trang đích
      router.push(result.redirectTo || redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra trong quá trình đăng ký.');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 text-[#f15a24] mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tạo tài khoản mới</h1>
        <p className="text-sm text-gray-500 mt-2">
          Đăng ký để truy cập đầy đủ bài viết và kiến thức chuyên sâu
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200/80 text-sm text-red-700 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
            Họ và tên
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ví dụ: Nguyễn Văn A"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0c5c36]/20 focus:border-[#0c5c36] text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
            Tên đăng nhập
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="viettatkhongdau"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0c5c36]/20 focus:border-[#0c5c36] text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
            Địa chỉ Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@company.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0c5c36]/20 focus:border-[#0c5c36] text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Tối thiểu 6 ký tự"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0c5c36]/20 focus:border-[#0c5c36] text-sm transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#f15a24] hover:bg-[#e04c06] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tạo tài khoản...
            </>
          ) : (
            'Đăng ký tài khoản'
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 font-medium">
            Hoặc tiếp tục nhanh với
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <GoogleLoginButton redirectUrl={redirectUrl} onError={(msg) => setError(msg)} />
        <FacebookLoginButton redirectUrl={redirectUrl} onError={(msg) => setError(msg)} />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link
          href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-semibold text-[#0c5c36] hover:text-[#f15a24] transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
