import { portfolioProjects } from '../../app/data/projects';

const locales = ['fa', 'en'] as const;
const staticRoutes = ['/', '/projects', '/contact', '/start-a-project'] as const;

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const getPublicSiteUrl = () => {
  const config = useRuntimeConfig();
  const configuredUrl = String(process.env.NUXT_PUBLIC_SITE_URL || config.public.siteUrl || 'https://sazan.studio').trim();

  return configuredUrl.replace(/\/$/, '');
};

const localizedPath = (locale: typeof locales[number], path: string) => `/${locale}${path === '/' ? '' : path}`;

const createUrlEntry = (siteUrl: string, path: string, priority: string) => {
  const loc = `${siteUrl}${path}`;
  const basePath = path.replace(/^\/(fa|en)/, '') || '/';
  const alternateLinks = locales.map((locale) => {
    const href = `${siteUrl}${localizedPath(locale, basePath)}`;

    return `    <xhtml:link rel="alternate" hreflang="${locale === 'fa' ? 'fa-IR' : 'en-US'}" href="${escapeXml(href)}" />`;
  }).join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    alternateLinks,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n');
};

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8');

  const siteUrl = getPublicSiteUrl();
  const publicProjectRoutes = portfolioProjects
    .filter((project) => project.status === 'published')
    .map((project) => `/projects/${project.slug}`);
  const allRoutes = [
    ...staticRoutes,
    ...publicProjectRoutes
  ];
  const entries = allRoutes.flatMap((route) => locales.map((locale) => {
    const priority = route === '/' ? '1.0' : route === '/projects' ? '0.8' : route.startsWith('/projects/') ? '0.7' : '0.6';

    return createUrlEntry(siteUrl, localizedPath(locale, route), priority);
  }));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.join('\n'),
    '</urlset>'
  ].join('\n');
});
