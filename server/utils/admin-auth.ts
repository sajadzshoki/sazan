import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';
import type { H3Event } from 'h3';
import { createError, deleteCookie, getCookie, setCookie } from 'h3';

const adminSessionCookieName = 'sazan_admin_session';

type AdminSessionPayload = {
  email: string;
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
};

export type AdminSession = AdminSessionPayload & {
  authenticated: true;
};

const toBase64Url = (value: string) => Buffer.from(value).toString('base64url');
const fromBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const timingSafeStringEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const signPayload = (payload: string, secret: string) => {
  return createHmac('sha256', secret).update(payload).digest('base64url');
};

const getAdminRuntimeConfig = () => {
  const config = useRuntimeConfig();
  const email = String(config.admin.email || '').trim().toLowerCase();
  const password = String(config.admin.password || '');
  const sessionSecret = String(config.admin.sessionSecret || '');
  const sessionMaxAgeSeconds = Number(config.admin.sessionMaxAgeSeconds || 60 * 60 * 8);

  return {
    email,
    password,
    sessionSecret,
    sessionMaxAgeSeconds: Number.isFinite(sessionMaxAgeSeconds) && sessionMaxAgeSeconds > 0
      ? sessionMaxAgeSeconds
      : 60 * 60 * 8,
    isConfigured: Boolean(email && password && sessionSecret)
  };
};

export const getAdminAuthStatus = () => {
  const config = getAdminRuntimeConfig();

  return {
    configured: config.isConfigured,
    sessionMaxAgeSeconds: config.sessionMaxAgeSeconds
  };
};

export const verifyAdminCredentials = (email: string, password: string) => {
  const config = getAdminRuntimeConfig();

  if (!config.isConfigured) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin authentication is not configured'
    });
  }

  return timingSafeStringEqual(email.trim().toLowerCase(), config.email)
    && timingSafeStringEqual(password, config.password);
};

export const createAdminSession = (event: H3Event, email: string): AdminSession => {
  const config = getAdminRuntimeConfig();

  if (!config.isConfigured) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Admin authentication is not configured'
    });
  }

  const issuedAt = Date.now();
  const expiresAt = issuedAt + config.sessionMaxAgeSeconds * 1000;
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    sessionId: randomUUID(),
    issuedAt,
    expiresAt
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, config.sessionSecret);

  setCookie(event, adminSessionCookieName, `${encodedPayload}.${signature}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: config.sessionMaxAgeSeconds
  });

  return {
    ...payload,
    authenticated: true
  };
};

export const getAdminSession = (event: H3Event): AdminSession | null => {
  const config = getAdminRuntimeConfig();
  const token = getCookie(event, adminSessionCookieName);

  if (!config.isConfigured || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, config.sessionSecret);

  if (!timingSafeStringEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AdminSessionPayload;

    if (!payload.email || !payload.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }

    return {
      ...payload,
      authenticated: true
    };
  } catch {
    return null;
  }
};

export const requireAdminSession = (event: H3Event) => {
  const session = getAdminSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Admin authentication required'
    });
  }

  return session;
};

export const clearAdminSession = (event: H3Event) => {
  deleteCookie(event, adminSessionCookieName, {
    path: '/'
  });
};
