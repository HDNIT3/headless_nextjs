'use client';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { googleLoginAction } from '@/service/auth.service';
import { useAuthAction } from './use-auth-action';

interface GoogleLoginButtonProps {
  redirectUrl?: string;
  onError?: (msg: string) => void;
}

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
      <div className="w-full max-w-[360px] min-h-[44px] flex items-center justify-center">
        {loading ? (
          <div className="w-full h-[44px] flex items-center justify-center gap-2 text-xs text-gray-500 border border-[#dadce0] rounded-[10px] bg-white">
            <svg className="animate-spin h-4 w-4 text-[#0c5c36]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xác thực tài khoản Google...
          </div>
        ) : (
          <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:!w-full [&>div>iframe]:!max-w-[360px]">
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
                onError?.('Đăng nhập Google không thành công. Vui lòng kiểm tra lại cấu hình.');
              }}
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
              width="360"
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
