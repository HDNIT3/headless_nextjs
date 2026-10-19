'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface UserSession {
  id: number;
  name: string;
  username: string;
  email?: string;
  roles?: string[];
  slug?: string;
  description?: string;
  avatarUrl?: string;
  loginTime: number;
}

function getWordPressBaseUrl(): string {
  const wpGraphqlUrl =
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    'http://localhost/prj/graphql';

  return wpGraphqlUrl.replace(/\/graphql\/?$/i, '').replace(/\/+$/, '');
}

/**
 * Đăng nhập bằng WordPress REST API tùy chỉnh (/wp-json/custom-auth/v1/login)
 */
export async function loginAction(formData: FormData) {
  const login = ((formData.get('login') || formData.get('username')) as string)?.trim();
  const password = (formData.get('password') as string)?.trim();
  const redirectTo = (formData.get('redirect') as string)?.trim() || '/';

  if (!login || !password) {
    return { success: false, message: 'Vui lòng điền đầy đủ tài khoản và mật khẩu.' };
  }

  const wpBase = getWordPressBaseUrl();

  try {
    const res = await fetch(`${wpBase}/wp-json/custom-auth/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password,
      }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const errorMsg = data?.message || 'Tài khoản hoặc mật khẩu không chính xác.';
      return {
        success: false,
        message: typeof errorMsg === 'string' ? errorMsg.replace(/<[^>]*>?/gm, '') : 'Đăng nhập không thành công.',
      };
    }

    const userData = data.user;

    const userSession: UserSession = {
      id: userData.id,
      name: userData.name || userData.username || login,
      username: userData.username || login,
      email: userData.email || '',
      roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles || 'subscriber'],
      loginTime: Date.now(),
    };

    const cookieStore = await cookies();
    cookieStore.set('wp_user_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return {
      success: true,
      message: 'Đăng nhập thành công!',
      redirectTo: redirectTo.startsWith('/') ? redirectTo : '/',
    };
  } catch (error: unknown) {
    console.error('[WordPress Auth Login Error]:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ WordPress. Hãy kiểm tra URL và đảm bảo WordPress đang hoạt động.',
    };
  }
}

/**
 * Đăng ký tài khoản mới qua WordPress REST API tùy chỉnh (/wp-json/custom-auth/v1/register)
 * Tự động tạo session cookie để người dùng đăng nhập ngay sau khi đăng ký thành công
 */
export async function registerAction(formData: FormData) {
  const username = (formData.get('username') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();
  const name = (formData.get('name') as string)?.trim() || username;
  const redirectTo = (formData.get('redirect') as string)?.trim() || '/';

  if (!username || !email || !password) {
    return { success: false, message: 'Vui lòng điền đầy đủ tên đăng nhập, email và mật khẩu.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }

  const wpBase = getWordPressBaseUrl();

  try {
    const res = await fetch(`${wpBase}/wp-json/custom-auth/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        name,
      }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const errorMsg = data?.message || 'Không thể đăng ký tài khoản. Vui lòng kiểm tra lại thông tin.';
      return {
        success: false,
        message: typeof errorMsg === 'string' ? errorMsg.replace(/<[^>]*>?/gm, '') : 'Đăng ký không thành công.',
      };
    }

    const userData = data.user;

    // Tự động tạo session đăng nhập ngay sau khi đăng ký
    const userSession: UserSession = {
      id: userData.id,
      name: userData.name || name || userData.username,
      username: userData.username || username,
      email: userData.email || email,
      roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles || 'subscriber'],
      loginTime: Date.now(),
    };

    const cookieStore = await cookies();
    cookieStore.set('wp_user_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      redirectTo: redirectTo.startsWith('/') ? redirectTo : '/',
    };
  } catch (error: unknown) {
    console.error('[WordPress Register Error]:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ WordPress.',
    };
  }
}

/**
 * Đăng nhập bằng Google qua WordPress REST API (/wp-json/custom-auth/v1/google-login)
 */
export async function googleLoginAction(credential: string, redirectTo: string = '/') {
  if (!credential) {
    return { success: false, message: 'Thiếu mã xác thực Google.' };
  }

  const wpBase = getWordPressBaseUrl();

  try {
    const res = await fetch(`${wpBase}/wp-json/custom-auth/v1/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential,
      }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const errorMsg = data?.message || 'Đăng nhập Google không thành công.';
      return {
        success: false,
        message: typeof errorMsg === 'string' ? errorMsg.replace(/<[^>]*>?/gm, '') : 'Đăng nhập Google thất bại.',
      };
    }

    const userData = data.user;

    const userSession: UserSession = {
      id: userData.id,
      name: userData.name || userData.username || 'Thành viên Google',
      username: userData.username,
      email: userData.email || '',
      roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles || 'subscriber'],
      avatarUrl: userData.avatarUrl || '',
      loginTime: Date.now(),
    };

    const cookieStore = await cookies();
    cookieStore.set('wp_user_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: 'Đăng nhập Google thành công!',
      redirectTo: redirectTo.startsWith('/') ? redirectTo : '/',
    };
  } catch (error: unknown) {
    console.error('[WordPress Google Login Error]:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ WordPress.',
    };
  }
}

/**
 * Đăng nhập bằng Facebook qua WordPress REST API (/wp-json/custom-auth/v1/facebook-login)
 */
export async function facebookLoginAction(accessToken: string, redirectTo: string = '/') {
  if (!accessToken) {
    return { success: false, message: 'Thiếu mã xác thực (accessToken) từ Facebook.' };
  }

  const wpBase = getWordPressBaseUrl();

  try {
    const res = await fetch(`${wpBase}/wp-json/custom-auth/v1/facebook-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
      }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const errorMsg = data?.message || 'Đăng nhập Facebook không thành công.';
      return {
        success: false,
        message: typeof errorMsg === 'string' ? errorMsg.replace(/<[^>]*>?/gm, '') : 'Đăng nhập Facebook thất bại.',
      };
    }

    const userData = data.user;

    const userSession: UserSession = {
      id: userData.id,
      name: userData.name || userData.username || 'Thành viên Facebook',
      username: userData.username,
      email: userData.email || '',
      roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles || 'subscriber'],
      avatarUrl: userData.avatarUrl || '',
      loginTime: Date.now(),
    };

    const cookieStore = await cookies();
    cookieStore.set('wp_user_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: 'Đăng nhập Facebook thành công!',
      redirectTo: redirectTo.startsWith('/') ? redirectTo : '/',
    };
  } catch (error: unknown) {
    console.error('[WordPress Facebook Login Error]:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ WordPress.',
    };
  }
}

/**
 * Đăng xuất
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('wp_user_session');
  redirect('/login');
}

/**
 * Lấy thông tin user hiện tại từ cookie
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('wp_user_session')?.value;
    if (!sessionCookie) return null;
    return JSON.parse(sessionCookie) as UserSession;
  } catch {
    return null;
  }
}
