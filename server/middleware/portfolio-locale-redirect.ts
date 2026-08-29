const supportedLocales = ['fa', 'en'] as const;
type SupportedLocale = typeof supportedLocales[number];

const isSupportedLocale = (value: string | undefined): value is SupportedLocale => {
  return value === 'fa' || value === 'en';
};

export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (url.pathname !== '/projects' && !url.pathname.startsWith('/projects/')) {
    return;
  }

  const cookieLocale = getCookie(event, 'sazan_locale');
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : 'fa';

  return sendRedirect(event, `/${locale}${url.pathname}${url.search}`, 302);
});
