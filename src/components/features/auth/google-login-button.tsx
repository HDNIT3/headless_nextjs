'use client';

import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { googleLoginAction } from '@/service/auth.service';

interface GoogleLoginButtonProps {
  redirectUrl?: string;
  onError?: (msg: string) => void;
}

export function GoogleLoginButton({ redirectUrl = '/', onError }: GoogleLoginButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!clientId) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full flex flex-col items-center justify-center min-h-[44px]">
        {loading ? (
          <div className="py-2.5 text-xs text-gray-500 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-[#0c5c36]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xác thực tài khoản Google...
          </div>
        ) : (
          <div className="w-full flex justify-center [&>div]:!rounded-[10px] [&_iframe]:!rounded-[10px]">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) {
                  onError?.('Không nhận được mã xác thực từ Google.');
                  return;
                }

                setLoading(true);
                try {
                  const res = await googleLoginAction(credentialResponse.credential, redirectUrl);
                  if (res.success) {
                    router.push(res.redirectTo || redirectUrl);
                    router.refresh();
                  } else {
                    setLoading(false);
                    onError?.(res.message || 'Đăng nhập Google thất bại.');
                  }
                } catch (err: unknown) {
                  setLoading(false);
                  onError?.(err instanceof Error ? err.message : 'Có lỗi xảy ra khi kết nối máy chủ.');
                }
              }}
              onError={() => {
                onError?.('Đăng nhập Google không thành công. Vui lòng thử lại.');
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
