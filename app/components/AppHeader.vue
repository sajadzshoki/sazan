<script setup lang="ts">
import { navItems } from '~/data/home';

const route = useRoute();
const localePath = useLocalePath();
const isMenuOpen = ref(false);
const homePath = computed(() => localePath('/'));
const startProjectPath = computed(() => localePath('/start-a-project'));

const getNavPath = (item: { path?: string; hash?: string }) => {
  if (item.path) {
    return localePath(item.path);
  }

  return `${homePath.value}${item.hash || ''}`;
};

const isNavItemActive = (item: { key: string; path?: string }) => {
  const path = item.path ? localePath(item.path) : homePath.value;

  if (item.key === 'home') {
    return route.path === path;
  }

  return route.path === path || route.path.startsWith(`${path}/`);
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

watch(() => route.fullPath, () => closeMenu());

watch(isMenuOpen, (open) => {
  if (!import.meta.client) {
    return;
  }

  document.body.style.overflow = open ? 'hidden' : '';
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <header class="sticky top-0 z-50">
    <a
      href="#main-content"
      class="sazan-focus sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:bg-surface focus:px-4 focus:py-2"
    >
      {{ $t('navigation.skipToContent') }}
    </a>

    <div class="border-b border-border bg-background/92 backdrop-blur-xl">
    <BaseContainer>
      <nav class="flex min-h-[var(--header-height)] items-center justify-between gap-3" :aria-label="$t('navigation.primary')">
        <NuxtLink :to="homePath" class="sazan-focus rounded-sm" @click="closeMenu">
          <SazanWordmark />
        </NuxtLink>

        <div class="hidden items-center gap-7 lg:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.key"
            :to="getNavPath(item)"
            class="sazan-focus nav-link"
            :aria-current="isNavItemActive(item) ? 'page' : undefined"
          >
            {{ $t(`navigation.links.${item.key}`) }}
          </NuxtLink>
        </div>

        <div class="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <ClientOnly>
            <ThemeSwitcher />
            <template #fallback>
              <span class="inline-block h-[1.9rem] w-[3.35rem] rounded-full border border-border" aria-hidden="true" />
            </template>
          </ClientOnly>
          <NuxtLink :to="startProjectPath" class="sazan-button-primary">
            {{ $t('common.startProject') }}
            <span class="arrow-icon" aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <button
          type="button"
          class="sazan-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground lg:hidden"
          :aria-label="isMenuOpen ? $t('navigation.closeMenu') : $t('navigation.openMenu')"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-navigation"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="relative block h-3.5 w-5" aria-hidden="true">
            <span class="menu-line menu-line-top" :class="{ 'is-open': isMenuOpen }" />
            <span class="menu-line menu-line-mid" :class="{ 'is-open': isMenuOpen }" />
            <span class="menu-line menu-line-bottom" :class="{ 'is-open': isMenuOpen }" />
          </span>
        </button>
      </nav>
    </BaseContainer>
    </div>

    <Transition name="mobile-menu">
      <div
        v-if="isMenuOpen"
        id="mobile-navigation"
        class="fixed inset-x-0 bottom-0 z-40 overflow-y-auto overscroll-contain bg-background lg:hidden"
        :style="{ top: 'var(--header-height)' }"
      >
        <BaseContainer>
          <div class="flex min-h-[calc(100dvh-var(--header-height))] flex-col justify-between py-8">
            <div class="grid">
              <NuxtLink
                v-for="(item, index) in navItems"
                :key="item.key"
                :to="getNavPath(item)"
                class="sazan-focus flex items-baseline justify-between border-b border-border py-5"
                :aria-current="isNavItemActive(item) ? 'page' : undefined"
                @click="closeMenu"
              >
                <span class="sazan-title-tight text-4xl font-extrabold" :class="isNavItemActive(item) ? 'text-primary' : 'text-foreground'">
                  {{ $t(`navigation.links.${item.key}`) }}
                </span>
                <span class="text-sm font-semibold text-muted">0{{ index + 1 }}</span>
              </NuxtLink>
            </div>

            <div class="mt-8 flex flex-col gap-4">
              <div class="flex items-center justify-between gap-3">
                <LanguageSwitcher />
                <ClientOnly>
                  <ThemeSwitcher />
                  <template #fallback>
                    <span class="inline-block h-[1.9rem] w-[3.35rem] rounded-full border border-border" aria-hidden="true" />
                  </template>
                </ClientOnly>
              </div>
              <NuxtLink :to="startProjectPath" class="sazan-button-primary w-full" @click="closeMenu">
                {{ $t('common.startProject') }}
                <span class="arrow-icon" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </BaseContainer>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-line {
  position: absolute;
  inset-inline-start: 0;
  height: 1px;
  width: 1.25rem;
  background: currentColor;
  transition: transform 180ms var(--ease-studio), opacity 180ms var(--ease-studio);
}

.menu-line-top {
  top: 0;
}

.menu-line-mid {
  top: 50%;
  transform: translateY(-50%);
}

.menu-line-bottom {
  bottom: 0;
}

.menu-line-top.is-open {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.menu-line-mid.is-open {
  opacity: 0;
}

.menu-line-bottom.is-open {
  bottom: auto;
  top: 50%;
  transform: translateY(-50%) rotate(-45deg);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 220ms var(--ease-studio), transform 220ms var(--ease-studio);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.6rem);
}
</style>
