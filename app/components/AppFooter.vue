<script setup lang="ts">
import { navItems, services, socialLinks } from '~/data/home';

const localePath = useLocalePath();
const year = new Date().getFullYear();
const homePath = computed(() => localePath('/'));
const getNavPath = (item: { path?: string; hash?: string }) => {
  if (item.path) {
    return localePath(item.path);
  }

  return `${homePath.value}${item.hash || ''}`;
};
</script>

<template>
  <footer class="border-t border-border bg-foreground text-background">
    <BaseContainer>
      <div class="grid gap-12 py-14 lg:grid-cols-[1.1fr_1.6fr] lg:py-18">
        <div class="max-w-md">
          <NuxtLink :to="homePath" class="sazan-focus inline-flex rounded-sm">
            <SazanWordmark inverted />
          </NuxtLink>
          <p class="mt-6 text-base leading-7 text-background/72">
            {{ $t('footer.statement') }}
          </p>
          <a href="mailto:hello@sazan.studio" class="sazan-focus mt-7 inline-flex text-2xl font-black tracking-[-0.05em]">
            {{ $t('footer.email') }}
          </a>
        </div>

        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <h2 class="footer-column-title text-xs font-black tracking-[0.16em] text-background/50 uppercase">
              {{ $t('footer.navigation') }}
            </h2>
            <ul class="mt-5 grid gap-3 text-sm text-background/75">
              <li v-for="item in navItems" :key="item.key">
                <a class="sazan-focus rounded-sm hover:text-background" :href="getNavPath(item)">
                  {{ $t(`navigation.links.${item.key}`) }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-column-title text-xs font-black tracking-[0.16em] text-background/50 uppercase">
              {{ $t('footer.services') }}
            </h2>
            <ul class="mt-5 grid gap-3 text-sm text-background/75">
              <li v-for="service in services" :key="service.key">
                {{ $t(`home.services.items.${service.key}.title`) }}
              </li>
            </ul>
          </div>

          <div>
            <h2 class="footer-column-title text-xs font-black tracking-[0.16em] text-background/50 uppercase">
              {{ $t('footer.social') }}
            </h2>
            <ul class="mt-5 grid gap-3 text-sm text-background/75">
              <li v-for="social in socialLinks" :key="social">
                <a href="#" class="sazan-focus rounded-sm hover:text-background">
                  {{ social }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-background/12 py-6 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between">
        <p>{{ $t('footer.copyright', { year }) }}</p>
        <p>{{ $t('footer.location') }}</p>
      </div>
    </BaseContainer>
  </footer>
</template>
