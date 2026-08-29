import { getAdminAuthStatus, getAdminSession } from '../../../utils/admin-auth';

export default defineEventHandler((event) => {
  const session = getAdminSession(event);

  return {
    authenticated: Boolean(session),
    configured: getAdminAuthStatus().configured,
    admin: session
      ? {
          email: session.email,
          expiresAt: session.expiresAt
        }
      : null
  };
});
