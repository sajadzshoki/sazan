<script setup lang="ts">
import { navItems } from '~/data/home';

const route = useRoute();
const localePath = useLocalePath();
const isMenuOpen = ref(false);

const homePath = computed(() => localePath('/'));

const getNavPath = (item: { path?: string; hash?: string }) => {
  if (item.path) {
    return localePath(item.path);
  }

  return `${homePath.value}${item.hash || ''}`;
};

const startProjectPath = computed(() => localePath('/start-a-project'));
const closeMenu = () => {
  isMenuOpen.value = false;
};

watch(
  () => route.fullPath,
  () => closeMenu()
);
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
    <a
      href="#main-content"
      class="sazan-focus sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2"
    >
      {{ $t('navigation.skipToContent') }}
    </a>

    <BaseContainer>
      <nav class="flex min-h-[var(--header-height)] items-center justify-between gap-5" :aria-label="$t('navigation.primary')">
        <NuxtLink :to="homePath" class="sazan-focus rounded-sm" @click="closeMenu">
          <SazanWordmark />
        </NuxtLink>

        <div class="hidden items-center gap-7 lg:flex">
          <a
            v-for="item in navItems"
            :key="item.key"
            :href="getNavPath(item)"
            class="sazan-link"
          >
            {{ $t(`navigation.links.${item.key}`) }}
          </a>
        </div>

        <div class="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <ClientOnly>
            <ThemeSwitcher />
            <template #fallback>
              <span class="inline-flex h-9 items-center rounded-full border border-border bg-surface/70 px-3 text-xs font-bold text-muted">
                {{ $t('theme.system') }}
              </span>
            </template>
          </ClientOnly>
          <NuxtLink :to="startProjectPath" class="sazan-button-primary">
            {{ $t('common.startProject') }}
          </NuxtLink>
        </div>

        <button
          type="button"
          class="sazan-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/75 text-foreground lg:hidden"
          :aria-label="isMenuOpen ? $t('navigation.closeMenu') : $t('navigation.openMenu')"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-navigation"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="relative h-3.5 w-5" aria-hidden="true">
            <span
              class="absolute start-0 top-0 h-px w-5 bg-current transition"
              :class="isMenuOpen ? 'translate-y-[0.42rem] rotate-45' : ''"
            />
            <span
              class="absolute bottom-0 start-0 h-px w-5 bg-current transition"
              :class="isMenuOpen ? '-translate-y-[0.42rem] -rotate-45' : ''"
            />
          </span>
        </button>
      </nav>
    </BaseContainer>

    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" id="mobile-navigation" class="border-t border-border bg-background/98 lg:hidden">
        <BaseContainer>
          <div class="grid gap-7 py-7">
            <div class="grid gap-1">
              <a
                v-for="item in navItems"
                :key="item.key"
                :href="getNavPath(item)"
                class="sazan-focus sazan-title-tight flex items-center justify-between border-b border-border py-4 text-2xl font-black"
                @click="closeMenu"
              >
                <span>{{ $t(`navigation.links.${item.key}`) }}</span>
                <span class="text-sm text-primary" aria-hidden="true">↗</span>
              </a>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <LanguageSwitcher />
              <ClientOnly>
                <ThemeSwitcher />
                <template #fallback>
                  <span class="inline-flex h-9 items-center rounded-full border border-border bg-surface/70 px-3 text-xs font-bold text-muted">
                    {{ $t('theme.system') }}
                  </span>
                </template>
              </ClientOnly>
            </div>

            <NuxtLink :to="startProjectPath" class="sazan-button-primary w-full" @click="closeMenu">
              {{ $t('common.startProject') }}
            </NuxtLink>
          </div>
        </BaseContainer>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}
</style>
