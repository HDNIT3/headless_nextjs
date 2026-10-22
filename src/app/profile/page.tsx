import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PageTransition } from '@/components/common/page-transition';
import { getCurrentUser, logoutAction } from '@/service/auth.service';

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng | Bao Bì Đức Trọng',
  description: 'Thông tin tài khoản và quản lý thông tin cá nhân.',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/profile');
  }

  const joinDate = user.loginTime
    ? new Date(user.loginTime).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Mới đăng nhập';

  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#0c5c36]">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Hồ sơ cá nhân</span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-[#0c5c36] via-[#107042] to-[#f15a24] relative">
            <div className="absolute -bottom-12 left-6 sm:left-10 flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-md border border-gray-100 overflow-hidden">
                <div className="w-full h-full rounded-xl overflow-hidden bg-emerald-50 text-[#0c5c36] flex items-center justify-center font-bold text-3xl sm:text-4xl">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      width={112}
                      height={112}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="pt-16 p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  @{user.username || 'user'} • Thành viên người dùng WordPress
                </p>
              </div>

              {/* Logout button */}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-all cursor-pointer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Đăng xuất
                </button>
              </form>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Email liên hệ
                </span>
                <p className="text-gray-900 font-semibold text-base mt-1">
                  {user.email || 'Chưa cập nhật'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Mã tài khoản (User ID)
                </span>
                <p className="text-gray-900 font-semibold text-base mt-1">
                  #{user.id}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Thời điểm phiên đăng nhập
                </span>
                <p className="text-gray-900 font-semibold text-base mt-1">
                  {joinDate}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Vai trò & Quyền hạn
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#0c5c36]">
                    ✓ {user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Thành viên (subscriber)'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                    Toàn quyền xem bài viết
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-orange-50/60 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-gray-900 text-base">
                  Khám phá bài viết và sản phẩm
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Bạn đã có thể đọc toàn bộ các bài viết độc quyền và nội dung chuyên ngành nông sản.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/blog"
                  className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-[#0c5c36] hover:bg-[#09472a] text-white text-sm font-semibold transition-all shadow-xs"
                >
                  Xem tin tức
                </Link>
                <Link
                  href="/san-pham"
                  className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-[#f15a24] hover:bg-[#e04c06] text-white text-sm font-semibold transition-all shadow-xs"
                >
                  Xem sản phẩm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
