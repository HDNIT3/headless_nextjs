import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/service/auth.service';

/**
 * Auth controls are rendered in their own Suspense boundary so reading the
 * session cookie never blocks the rest of the header.
 */
export async function HeaderUser() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0c5c36] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
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
          className="text-gray-500"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Đăng nhập</span>
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-[#0c5c36] text-xs sm:text-sm font-semibold transition-colors"
      title="Xem trang cá nhân"
    >
      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#0c5c36] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={24}
            height={24}
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : user.name ? (
          user.name.charAt(0).toUpperCase()
        ) : (
          'U'
        )}
      </div>
      <span className="max-w-[90px] truncate hidden md:inline">{user.name}</span>
    </Link>
  );
}
