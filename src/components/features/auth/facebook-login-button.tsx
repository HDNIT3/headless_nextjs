'use client';

import { useState, useEffect } from 'react';
import { facebookLoginAction } from '@/service/auth.service';
import { useAuthAction } from './use-auth-action';

declare global {
  interface Window {
    FB?: {
      init: (params: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (
        callback: (response: {
          authResponse?: { accessToken: string; userID: string };
          status: string;
        }) => void,
        options?: { scope: string }
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

interface FacebookLoginButtonProps {
  redirectUrl?: string;
  onError?: (msg: string) => void;
}

export function FacebookLoginButton({ redirectUrl = '/', onError }: FacebookLoginButtonProps) {
  const { loading, setLoading, submit } = useAuthAction({
    fallbackMessage: 'Lỗi kết nối máy chủ khi đăng nhập Facebook.',
    onError,
  });
  // Khởi tạo từ window để trường hợp SDK đã tải sẵn (điều hướng client-side quay lại trang) không bị "kẹt" disabled
  const [sdkReady, setSdkReady] = useState(() => typeof window !== 'undefined' && Boolean(window.FB));
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

  useEffect(() => {
    if (!appId || window.FB) return;

    window.fbAsyncInit = function () {
      window.FB?.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      setSdkReady(true);
    };

    const existingScript = document.getElementById('facebook-jssdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => setSdkReady(true));
      return;
    }

    const js = document.createElement('script');
    js.id = 'facebook-jssdk';
    js.src = 'https://connect.facebook.net/vi_VN/sdk.js';
    js.async = true;
    js.defer = true;
    js.addEventListener('load', () => setSdkReady(true));
    document.body.appendChild(js);
  }, [appId]);

  if (!appId) {
    return null;
  }

  const handleFacebookLogin = () => {
    if (!window.FB) {
      onError?.('Facebook SDK chưa tải xong, vui lòng thử lại sau giây lát.');
      return;
    }

    setLoading(true);

    window.FB.login(
      (response) => {
        const token = response.authResponse?.accessToken;
        if (!token) {
          // Người dùng hủy popup hoặc không đồng ý cấp quyền
          setLoading(false);
          return;
        }

        void submit(() => facebookLoginAction(token, redirectUrl));
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={loading || !sdkReady}
      className="w-full max-w-[360px] h-[44px] px-4 rounded-[10px] bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-[#1877F2]"
      title="Đăng nhập bằng tài khoản Facebook"
    >
      {loading ? (
        <span className="flex items-center gap-2 text-xs">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xác thực Facebook...
        </span>
      ) : (
        <>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Tiếp tục với Facebook</span>
        </>
      )}
    </button>
  );
}
