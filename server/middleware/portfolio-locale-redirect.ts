const supportedLocales = ['fa', 'en'] as const;
type SupportedLocale = typeof supportedLocales[number];

const isSupportedLocale = (value: string | undefined): value is SupportedLocale => {
  return value === 'fa' || value === 'en';
};

const localizedPublicRoutes = ['/projects', '/start-a-project', '/contact'] as const;

const shouldRedirectPath = (pathname: string) => {
  return localizedPublicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};

export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (!shouldRedirectPath(url.pathname)) {
    return;
  }

  const cookieLocale = getCookie(event, 'sazan_locale');
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : 'fa';

  return sendRedirect(event, `/${locale}${url.pathname}${url.search}`, 302);
});
