type AdminSessionResponse = {
  authenticated: boolean;
  configured: boolean;
};

const isAdminPath = (path: string) => path === '/admin' || path.startsWith('/admin/');
const isAdminLoginPath = (path: string) => path === '/admin/login';

export default defineNuxtRouteMiddleware(async (to) => {
  if (!isAdminPath(to.path)) {
    return;
  }

  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {};
  const fetchOptions = requestHeaders.cookie ? { headers: { cookie: requestHeaders.cookie } } : {};

  try {
    const session = await $fetch<AdminSessionResponse>('/api/admin/auth/session', fetchOptions);

    if (isAdminLoginPath(to.path)) {
      if (session.authenticated) {
        return navigateTo('/admin');
      }

      return;
    }

    if (!session.authenticated) {
      return navigateTo({
        path: '/admin/login',
        query: {
          redirect: to.fullPath
        }
      });
    }
  } catch {
    if (!isAdminLoginPath(to.path)) {
      return navigateTo({
        path: '/admin/login',
        query: {
          redirect: to.fullPath
        }
      });
    }
  }
});
