import { computed, toValue, type MaybeRefOrGetter } from 'vue';

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>> | null | undefined;

type PublicSeoOptions = {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  type?: MaybeRefOrGetter<'website' | 'article'>;
  image?: MaybeRefOrGetter<string | undefined>;
  structuredData?: MaybeRefOrGetter<JsonLdValue>;
};

const localeCodes = ['fa', 'en'] as const;
type PublicLocale = typeof localeCodes[number];

const normalizeSiteUrl = (value: unknown) => {
  const configured = typeof value === 'string' && value.trim() ? value.trim() : 'https://sazan.studio';
  return configured.replace(/\/$/, '');
};

const stripHash = (value: string) => value.split('#')[0] || '/';

// Filters such as `category` are views of the same page, so they are not canonical.
const indexableQueryKeys = new Set<string>();

const canonicalPath = (fullPath: string) => {
  const withoutHash = stripHash(fullPath);
  const [pathname = '/', queryString = ''] = withoutHash.split('?');
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname || '/';
  const params = new URLSearchParams(queryString);
  const kept = new URLSearchParams();

  for (const key of indexableQueryKeys) {
    const value = params.get(key);

    if (value) {
      kept.set(key, value);
    }
  }

  const query = kept.toString();

  return query ? `${path}?${query}` : path;
};

const stripLocalePrefix = (path: string) => {
  for (const locale of localeCodes) {
    const prefix = `/${locale}`;

    if (path === prefix) {
      return '/';
    }

    if (path.startsWith(`${prefix}/`)) {
      return path.slice(prefix.length) || '/';
    }
  }

  return path || '/';
};

const withLocalePrefix = (path: string, locale: PublicLocale) => {
  const cleanPath = stripLocalePrefix(path.split('?')[0] || '/');
  const query = path.includes('?') ? `?${path.split('?').slice(1).join('?')}` : '';

  return `/${locale}${cleanPath === '/' ? '' : cleanPath}${query}`;
};

export const usePublicSeo = (options: PublicSeoOptions) => {
  const route = useRoute();
  const config = useRuntimeConfig();
  const { locale } = useI18n();

  const siteUrl = computed(() => normalizeSiteUrl(config.public.siteUrl));
  const routePath = computed(() => canonicalPath(route.fullPath));
  const canonicalUrl = computed(() => `${siteUrl.value}${routePath.value}`);
  const title = computed(() => toValue(options.title));
  const description = computed(() => toValue(options.description));
  const usesSharedImage = computed(() => !toValue(options.image));
  const imageUrl = computed(() => {
    const image = toValue(options.image) || '/og.png';
    return image.startsWith('http') ? image : `${siteUrl.value}${image.startsWith('/') ? image : `/${image}`}`;
  });
  const ogLocale = computed(() => locale.value === 'en' ? 'en_US' : 'fa_IR');
  const ogLocaleAlternate = computed(() => locale.value === 'en' ? 'fa_IR' : 'en_US');

  useSeoMeta({
    title,
    ogTitle: title,
    twitterTitle: title,
    description,
    ogDescription: description,
    twitterDescription: description,
    ogType: () => toValue(options.type) || 'website',
    ogSiteName: 'SAZAN',
    ogLocale,
    ogLocaleAlternate,
    ogUrl: canonicalUrl,
    ogImage: imageUrl,
    ogImageType: () => usesSharedImage.value ? 'image/png' : undefined,
    ogImageWidth: () => usesSharedImage.value ? 1200 : undefined,
    ogImageHeight: () => usesSharedImage.value ? 630 : undefined,
    twitterImage: imageUrl,
    twitterCard: 'summary_large_image'
  });

  useHead({
    link: () => [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'fa-IR', href: `${siteUrl.value}${withLocalePrefix(routePath.value, 'fa')}` },
      { rel: 'alternate', hreflang: 'en-US', href: `${siteUrl.value}${withLocalePrefix(routePath.value, 'en')}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl.value}${withLocalePrefix(routePath.value, 'fa')}` }
    ],
    script: () => {
      if (!options.structuredData) {
        return [];
      }

      const structuredData = toValue(options.structuredData);

      if (!structuredData) {
        return [];
      }

      return [
        {
          key: `json-ld-${route.path}`,
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData)
        }
      ];
    }
  });

  return {
    siteUrl,
    canonicalUrl
  };
};
