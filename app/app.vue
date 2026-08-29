<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const { direction, language } = useAppDirection();

const isAdminRoute = computed(() => route.path === '/admin' || route.path.startsWith('/admin/'));

useHead({
  htmlAttrs: {
    lang: language,
    dir: direction
  },
  bodyAttrs: {
    class: 'bg-background text-foreground'
  },
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} · ${t('brand.name')}` : t('brand.name')),
  meta: () => [
    {
      key: 'robots',
      name: 'robots',
      content: isAdminRoute.value ? 'noindex, nofollow, noarchive' : 'index, follow'
    }
  ]
});

useSeoMeta({
  title: () => t('brand.tagline'),
  ogTitle: () => t('brand.tagline'),
  description: () => t('home.hero.lead'),
  ogDescription: () => t('home.hero.lead')
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
