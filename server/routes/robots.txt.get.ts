const getPublicSiteUrl = () => {
  const config = useRuntimeConfig();
  const configuredUrl = String(process.env.NUXT_PUBLIC_SITE_URL || config.public.siteUrl || 'https://sazan.studio').trim();

  return configuredUrl.replace(/\/$/, '');
};

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8');

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api/admin',
    'Disallow: /api/admin/',
    '',
    `Sitemap: ${getPublicSiteUrl()}/sitemap.xml`,
    ''
  ].join('\n');
});
