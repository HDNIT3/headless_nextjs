'use client';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { googleLoginAction } from '@/service/auth.service';
import { useAuthAction } from './use-auth-action';

interface GoogleLoginButtonProps {
  redirectUrl?: string;
  onError?: (msg: string) => void;
}

// Bỏ qua cảnh báo vô hại của Google Identity Services khi re-initialize trong môi trường SPA Next.js
if (typeof window !== 'undefined') {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('google.accounts.id.initialize() is called multiple times')
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

/**
 * Nút đăng nhập Google.
 *
 * Vì sao không dùng trực tiếp nút của Google Identity Services (GIS)?
 * GIS luôn nhúng nút thật trong một <iframe> rộng hơn nút ~20px (bù bằng `margin: -10px`)
 * và không cho nút hẹp hơn khoảng 310px (do nhãn tiếng Việt khá dài). Hệ quả là trên
 * điện thoại nút Google không thể rộng bằng nút Facebook: lúc thì hẹp hơn + lệch trái
 * (khi iframe bị `max-width: 100%` cắt bớt), lúc thì tràn ra ngoài khung (khi khung hẹp
 * hơn 310px).
 *
 * Cách làm ở đây: tự vẽ phần hiển thị (kích thước y hệt nút Facebook) rồi phủ iframe
 * GIS trong suốt lên trên để hứng sự kiện click. Nhờ vậy giao diện luôn khớp với nút
 * Facebook ở mọi kích thước màn hình mà vẫn giữ nguyên luồng lấy credential của Google.
 * Iframe được đặt `absolute` + `overflow-hidden` nên không ảnh hưởng tới layout.
 */
export function GoogleLoginButton({ redirectUrl = '/', onError }: GoogleLoginButtonProps) {
  const { loading, submit } = useAuthAction({
    fallbackMessage: 'Có lỗi xảy ra khi kết nối máy chủ.',
    onError,
  });
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!clientId) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="group relative w-full max-w-[360px] h-[44px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="animate-spin h-4 w-4 text-[#0c5c36]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xác thực tài khoản Google...
          </div>
        ) : (
          <>
            {/* Phần hiển thị: sao chép đúng khung của nút Facebook (w-full, cao 44px, bo 10px) */}
            <div
              aria-hidden="true"
              className="pointer-events-none w-full h-[44px] px-4 rounded-[10px] border border-[#dadce0] bg-white group-hover:bg-[#f8f9fa] text-[#3c4043] font-medium text-sm transition-colors shadow-xs flex items-center justify-center gap-3 select-none"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Tiếp tục với Google</span>
            </div>

            {/* Nút GIS thật (trong suốt). `scale-y-110` giúp vùng bấm cao đủ 44px
                như nút hiển thị; iframe bị cắt bởi overflow-hidden nên không tràn layout. */}
            <div className="absolute inset-0 overflow-hidden rounded-[10px] opacity-0 [&_iframe]:origin-top [&_iframe]:scale-y-110">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const credential = credentialResponse.credential;
                  if (!credential) {
                    onError?.('Không nhận được mã xác thực từ Google.');
                    return;
                  }

                  await submit(() => googleLoginAction(credential, redirectUrl));
                }}
                onError={() => {
                  onError?.('Đăng nhập Google không thành công. Vui lòng thử lại.');
                }}
                theme="outline"
                size="large"
                shape="rectangular"
                text="continue_with"
                width={360}
              />
            </div>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
