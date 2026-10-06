<script setup lang="ts">
const { t, locale } = useI18n();
const config = useRuntimeConfig();
const siteUrl = computed(() => String(config.public.siteUrl || 'https://sazan.studio').replace(/\/$/, ''));
const { data: siteSettings } = await useFetch('/api/site-settings', { key: 'site-settings' });

const configuredValue = (managed: unknown, fallback: unknown) => {
  const primary = typeof managed === 'string' ? managed.trim() : '';
  const secondary = typeof fallback === 'string' ? fallback.trim() : '';

  return primary || secondary;
};

usePublicSeo({
  title: () => t('studio.hero.seoTitle'),
  description: () => t('studio.hero.lead'),
  structuredData: () => {
    const managedContact = siteSettings.value?.contact;
    const configuredContact = config.public.contact;
    const email = configuredValue(managedContact?.email, configuredContact?.email);
    const sameAs = [
      configuredValue(managedContact?.social?.linkedin, configuredContact?.social?.linkedin),
      configuredValue(managedContact?.social?.behance, configuredContact?.social?.behance),
      configuredValue(managedContact?.social?.dribbble, configuredContact?.social?.dribbble)
    ].filter(Boolean);
    const organization: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SAZAN',
      url: siteUrl.value,
      logo: `${siteUrl.value}/logo-nav.png`,
      description: t('studio.hero.lead')
    };

    if (email) {
      organization.email = email;
    }

    if (sameAs.length > 0) {
      organization.sameAs = sameAs;
    }

    return [
      organization,
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SAZAN',
        url: siteUrl.value,
        inLanguage: locale.value === 'fa' ? 'fa-IR' : 'en-US'
      }
    ];
  }
});
</script>

<template>
  <div>
    <HomeHero />
    <HomeTechStrip />
    <HomeAgencyStatement />
    <HomeSelectedWork />
    <HomeServices />
    <HomeProcess />
    <HomeStack />
    <HomeProjectCta />
  </div>
</template>
