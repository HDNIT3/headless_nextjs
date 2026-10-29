import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'wp_user_session';

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

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

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      return 'dev-headless-store-session-secret-at-least-32-chars-long';
    }
    throw new Error('Thiếu biến môi trường SESSION_SECRET (xem .env.example).');
  }
  return secret;
}

function sign(payloadBase64: string): string {
  return createHmac('sha256', getSecret()).update(payloadBase64).digest('base64url');
}

export function encodeSession(session: UserSession): string {
  const payload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined | null): UserSession | null {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (provided.length !== wanted.length || !timingSafeEqual(provided, wanted)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data?.id !== 'number' || typeof data?.name !== 'string') return null;
    if (typeof data?.loginTime !== 'number') return null;
    if (Date.now() - data.loginTime > SESSION_MAX_AGE * 1000) return null;

    return {
      id: data.id,
      name: data.name,
      username: typeof data.username === 'string' ? data.username : '',
      email: typeof data.email === 'string' ? data.email : '',
      roles: Array.isArray(data.roles) ? data.roles.map(String) : [],
      slug: typeof data.slug === 'string' ? data.slug : undefined,
      description: typeof data.description === 'string' ? data.description : undefined,
      avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : undefined,
      loginTime: data.loginTime,
    };
  } catch {
    return null;
  }
}

export async function createSession(session: UserSession, remember = true): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(remember ? { maxAge: SESSION_MAX_AGE } : {}),
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<UserSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decodeSession(token);
}
