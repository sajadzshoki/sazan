import { createAdminSession, verifyAdminCredentials } from '../../../utils/admin-auth';

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

const sanitize = (value: unknown, maxLength: number) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export default defineEventHandler(async (event) => {
  const body = (await readBody<LoginPayload>(event)) || {};
  const email = sanitize(body.email, 254);
  const password = typeof body.password === 'string' ? body.password.slice(0, 1024) : '';

  if (!email || !password || !verifyAdminCredentials(email, password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid admin credentials'
    });
  }

  const session = createAdminSession(event, email);

  return {
    ok: true,
    admin: {
      email: session.email,
      expiresAt: session.expiresAt
    }
  };
});
