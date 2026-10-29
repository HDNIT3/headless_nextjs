'use server';

import { redirect } from 'next/navigation';
import {
  createSession,
  destroySession,
  readSession,
  type UserSession,
} from '@/lib/auth/session';

export type ActionResult =
  | { success: true; message: string; redirectTo: string }
  | { success: false; message: string };

interface UserFallback {
  name?: string;
  username?: string;
  email?: string;
}

type CredentialsResult =
  | { ok: true; session: UserSession }
  | { ok: false; message: string };

interface CredentialsOptions {
  failureMessage: string;
  connectionMessage: string;
  fallbackUser?: UserFallback;
}

const WORDPRESS_AUTH_ENDPOINT = '/wp-json/custom-auth/v1';

function getWordPressBaseUrl(): string {
  if (process.env.WORDPRESS_URL) {
    return process.env.WORDPRESS_URL.replace(/\/+$/, '');
  }

  const wpGraphqlUrl =
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    'http://localhost/prj/graphql';

  return wpGraphqlUrl.replace(/\/graphql\/?$/i, '').replace(/\/+$/, '');
}

function safeRedirect(target: string | null | undefined): string {
  if (!target) return '/';
  if (!target.startsWith('/')) return '/';
  if (target.startsWith('//') || target.startsWith('/\\')) return '/';
  return target;
}

function errorMessage(data: unknown, fallback: string): string {
  const message = (data as { message?: unknown } | null)?.message;
  if (typeof message !== 'string' || !message.trim()) return fallback;
  return message.replace(/<[^>]*>?/gm, '').trim() || fallback;
}

function buildSession(userData: unknown, fallback: UserFallback = {}): UserSession | null {
  const user = userData as Record<string, unknown> | null;
  if (!user || typeof user.id !== 'number') return null;

  const username =
    (typeof user.username === 'string' && user.username) || fallback.username || '';
  const name =
    (typeof user.name === 'string' && user.name) || fallback.name || username || 'Thành viên';

  return {
    id: user.id,
    name,
    username,
    email: (typeof user.email === 'string' && user.email) || fallback.email || '',
    roles: Array.isArray(user.roles)
      ? user.roles.map(String)
      : [typeof user.roles === 'string' ? user.roles : 'subscriber'],
    avatarUrl: typeof user.avatarUrl === 'string' && user.avatarUrl ? user.avatarUrl : undefined,
    loginTime: Date.now(),
  };
}

async function exchangeCredentials(
  path: string,
  body: Record<string, unknown>,
  { failureMessage, connectionMessage, fallbackUser }: CredentialsOptions
): Promise<CredentialsResult> {
  try {
    const res = await fetch(`${getWordPressBaseUrl()}${WORDPRESS_AUTH_ENDPOINT}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data: unknown = await res.json().catch(() => null);

    if (!res.ok || !(data as { success?: boolean } | null)?.success) {
      return { ok: false, message: errorMessage(data, failureMessage) };
    }

    const session = buildSession((data as { user?: unknown }).user, fallbackUser);
    if (!session) {
      return { ok: false, message: 'Máy chủ WordPress trả về dữ liệu không hợp lệ.' };
    }

    return { ok: true, session };
  } catch (error: unknown) {
    console.error(`[WordPress Auth] ${path}:`, error);
    return { ok: false, message: connectionMessage };
  }
}

/**
 * Đăng nhập bằng WordPress REST API tuỳ chỉnh (/wp-json/custom-auth/v1/login)
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const login = ((formData.get('login') || formData.get('username')) as string | null)?.trim();
  // Không trim mật khẩu: ký tự đầu/cuối có thể là một phần mật khẩu hợp lệ.
  const password = formData.get('password') as string | null;
  const redirectTo = safeRedirect(formData.get('redirect') as string | null);
  const remember = formData.get('remember') !== 'false';

  if (!login || !password) {
    return { success: false, message: 'Vui lòng điền đầy đủ tài khoản và mật khẩu.' };
  }

  const result = await exchangeCredentials(
    '/login',
    { login, password },
    {
      failureMessage: 'Tài khoản hoặc mật khẩu không chính xác.',
      connectionMessage:
        'Không thể kết nối đến máy chủ WordPress. Hãy kiểm tra URL và đảm bảo WordPress đang hoạt động.',
      fallbackUser: { username: login },
    }
  );

  if (!result.ok) return { success: false, message: result.message };

  await createSession(result.session, remember);

  return { success: true, message: 'Đăng nhập thành công!', redirectTo };
}

/**
 * Đăng ký tài khoản mới qua WordPress REST API tùy chỉnh (/wp-json/custom-auth/v1/register)
 * Tự động tạo session cookie để người dùng đăng nhập ngay sau khi đăng ký thành công
 */
export async function registerAction(formData: FormData): Promise<ActionResult> {
  const username = (formData.get('username') as string | null)?.trim();
  const email = (formData.get('email') as string | null)?.trim();
  const password = formData.get('password') as string | null;
  const name = (formData.get('name') as string | null)?.trim() || undefined;
  const redirectTo = safeRedirect(formData.get('redirect') as string | null);

  if (!username || !email || !password) {
    return { success: false, message: 'Vui lòng điền đầy đủ tên đăng nhập, email và mật khẩu.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }

  const result = await exchangeCredentials(
    '/register',
    { username, email, password, name: name || username },
    {
      failureMessage: 'Không thể đăng ký tài khoản. Vui lòng kiểm tra lại thông tin.',
      connectionMessage: 'Không thể kết nối đến máy chủ WordPress.',
      fallbackUser: { name, username, email },
    }
  );

  if (!result.ok) return { success: false, message: result.message };

  // Tự động tạo session đăng nhập ngay sau khi đăng ký
  await createSession(result.session, true);

  return { success: true, message: 'Đăng ký tài khoản thành công!', redirectTo };
}

/**
 * Đăng nhập bằng Google qua WordPress REST API (/wp-json/custom-auth/v1/google-login)
 */
export async function googleLoginAction(
  credential: string,
  redirectTo: string = '/'
): Promise<ActionResult> {
  const target = safeRedirect(redirectTo);

  if (!credential) {
    return { success: false, message: 'Thiếu mã xác thực Google.' };
  }

  const result = await exchangeCredentials(
    '/google-login',
    { credential },
    {
      failureMessage: 'Đăng nhập Google không thành công.',
      connectionMessage: 'Không thể kết nối đến máy chủ WordPress.',
      fallbackUser: { name: 'Thành viên Google' },
    }
  );

  if (!result.ok) return { success: false, message: result.message };

  await createSession(result.session, true);

  return { success: true, message: 'Đăng nhập Google thành công!', redirectTo: target };
}

/**
 * Đăng nhập bằng Facebook qua WordPress REST API (/wp-json/custom-auth/v1/facebook-login)
 */
export async function facebookLoginAction(
  accessToken: string,
  redirectTo: string = '/'
): Promise<ActionResult> {
  const target = safeRedirect(redirectTo);

  if (!accessToken) {
    return { success: false, message: 'Thiếu mã xác thực (accessToken) từ Facebook.' };
  }

  const result = await exchangeCredentials(
    '/facebook-login',
    { accessToken },
    {
      failureMessage: 'Đăng nhập Facebook không thành công.',
      connectionMessage: 'Không thể kết nối đến máy chủ WordPress.',
      fallbackUser: { name: 'Thành viên Facebook' },
    }
  );

  if (!result.ok) return { success: false, message: result.message };

  await createSession(result.session, true);

  return { success: true, message: 'Đăng nhập Facebook thành công!', redirectTo: target };
}

/**
 * Đăng xuất
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}

/**
 * Lấy thông tin user hiện tại từ cookie (đã xác thực chữ ký).
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  return readSession();
}
