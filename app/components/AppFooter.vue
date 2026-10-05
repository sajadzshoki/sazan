<script setup lang="ts">
import { navItems, services } from '~/data/home';

const localePath = useLocalePath();
const config = useRuntimeConfig();
const { data: siteSettings } = await useFetch('/api/site-settings', { key: 'site-settings' });
const year = new Date().getFullYear();
const homePath = computed(() => localePath('/'));
const publicContact = computed(() => siteSettings.value?.contact || config.public.contact);
const contactEmail = computed(() => publicContact.value?.email || 'hello@sazan.studio');
const contactEmailHref = computed(() => `mailto:${contactEmail.value}`);
const footerSocialLinks = computed(() => [
  { label: 'LinkedIn', href: publicContact.value?.social?.linkedin || '' },
  { label: 'Behance', href: publicContact.value?.social?.behance || '' },
  { label: 'Dribbble', href: publicContact.value?.social?.dribbble || '' }
].filter((item) => item.href));

const getNavPath = (item: { path?: string; hash?: string }) => {
  if (item.path) {
    return localePath(item.path);
  }

  return `${homePath.value}${item.hash || ''}`;
};
</script>

<template>
  <footer class="border-t border-border bg-soft text-foreground">
    <BaseContainer>
      <div class="grid gap-12 py-14 lg:grid-cols-[1.15fr_1.4fr] lg:py-16">
        <div class="max-w-md">
          <NuxtLink :to="homePath" class="sazan-focus inline-flex rounded-sm">
            <SazanWordmark />
          </NuxtLink>
          <p class="mt-6 max-w-sm text-base leading-7 text-muted">
            {{ $t('footer.statement') }}
          </p>
          <a :href="contactEmailHref" class="sazan-focus mt-6 inline-flex text-lg font-semibold text-foreground" dir="ltr">
            {{ contactEmail }}
          </a>
        </div>

        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <h2 class="footer-label">
              {{ $t('footer.navigation') }}
            </h2>
            <ul class="mt-4 grid gap-2.5 text-sm text-muted">
              <li v-for="item in navItems" :key="item.key">
                <NuxtLink class="sazan-focus rounded-sm hover:text-foreground" :to="getNavPath(item)">
                  {{ $t(`navigation.links.${item.key}`) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-label">
              {{ $t('footer.services') }}
            </h2>
            <ul class="mt-4 grid gap-2.5 text-sm text-muted">
              <li v-for="service in services" :key="service.key">
                <NuxtLink class="hover:text-foreground" :to="localePath(`/services#${service.key}`)">
                  {{ $t(`home.services.items.${service.key}.title`) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-label">
              {{ $t('footer.connect') }}
            </h2>
            <ul class="mt-4 grid gap-2.5 text-sm text-muted">
              <li v-for="social in footerSocialLinks" :key="social.label">
                <a :href="social.href" target="_blank" rel="noopener noreferrer" class="sazan-focus rounded-sm hover:text-foreground">
                  {{ social.label }}
                </a>
              </li>
              <li>
                <NuxtLink :to="localePath('/contact')" class="hover:text-foreground">
                  {{ $t('navigation.links.contact') }}
                </NuxtLink>
              </li>
            </ul>
            <div class="mt-5">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-border py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{{ $t('footer.copyright', { year }) }}</p>
        <p>{{ $t('footer.location') }}</p>
      </div>
    </BaseContainer>
  </footer>
</template>

<style scoped>
.footer-label {
  color: rgb(var(--color-muted));
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

html[dir='rtl'] .footer-label {
  letter-spacing: 0;
  text-transform: none;
  font-size: 0.84rem;
}
</style>
