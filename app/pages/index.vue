<script setup lang="ts">
const { t, locale } = useI18n();
const config = useRuntimeConfig();
const siteUrl = computed(() => String(config.public.siteUrl || 'https://sazan.studio').replace(/\/$/, ''));

usePublicSeo({
  title: () => t('brand.tagline'),
  description: () => t('home.hero.lead'),
  structuredData: () => [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SAZAN',
      url: siteUrl.value,
      logo: `${siteUrl.value}/favicon.svg`,
      description: t('home.hero.lead'),
      sameAs: [
        config.public.contact?.social?.linkedin,
        config.public.contact?.social?.behance,
        config.public.contact?.social?.dribbble
      ].filter(Boolean)
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SAZAN',
      url: siteUrl.value,
      inLanguage: locale.value === 'fa' ? 'fa-IR' : 'en-US'
    }
  ]
});
</script>

<template>
  <div>
    <HomeHero />
    <HomeSelectedWork />
    <HomeServices />
    <HomeProcess />
    <HomeAgencyStatement />
    <HomeProjectCta />
  </div>
</template>
