const supportedLocales = ['fa', 'en'] as const;
type SupportedLocale = typeof supportedLocales[number];

const isSupportedLocale = (value: string | undefined): value is SupportedLocale => {
  return value === 'fa' || value === 'en';
};

const localizedPublicRoutes = ['/projects', '/services', '/about', '/contact', '/start-a-project'] as const;

const isUnprefixedPublicRoute = (pathname: string) => {
  return localizedPublicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};

const isLocalizedPublicRoute = (pathname: string) => {
  const unprefixed = pathname.replace(/^\/(fa|en)(?=\/|$)/, '') || '/';

  return unprefixed === '/' || isUnprefixedPublicRoute(unprefixed);
};

const stripTrailingSlash = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/';
  }

  return pathname;
};

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;

  if (pathname.length > 1 && pathname.endsWith('/') && (isLocalizedPublicRoute(pathname) || isUnprefixedPublicRoute(pathname))) {
    return sendRedirect(event, `${stripTrailingSlash(pathname)}${url.search}`, 301);
  }

  if (!isUnprefixedPublicRoute(pathname)) {
    return;
  }

  const cookieLocale = getCookie(event, 'sazan_locale');
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : 'fa';

  return sendRedirect(event, `/${locale}${stripTrailingSlash(pathname)}${url.search}`, 302);
});
