<script setup lang="ts">
type AdminLocale = 'fa' | 'en';

const route = useRoute();
const { t, locale, setLocaleCookie } = useI18n();
const { direction } = useAppDirection();

const localeOptions: AdminLocale[] = ['fa', 'en'];

const navItems = computed(() => [
  { label: t('admin.nav.dashboard'), to: '/admin', icon: '◎' },
  { label: t('admin.nav.projects'), to: '/admin/projects', icon: '▦' },
  { label: t('admin.nav.categories'), to: '/admin/categories', icon: '◇' },
  { label: t('admin.nav.services'), to: '/admin/services', icon: '✦' },
  { label: t('admin.nav.requests'), to: '/admin/requests', icon: '●' },
  { label: t('admin.nav.settings'), to: '/admin/settings', icon: '☰' }
]);

const isDrawerOpen = ref(false);
const isLoggingOut = ref(false);

const currentTitle = computed(() => navItems.value.find((item) => item.to === route.path)?.label || t('admin.title'));

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin';
  }

  return route.path === path || route.path.startsWith(`${path}/`);
};

const switchLocale = (targetLocale: AdminLocale) => {
  if (locale.value === targetLocale) {
    return;
  }

  locale.value = targetLocale;
  setLocaleCookie(targetLocale);
};

const logout = async () => {
  if (isLoggingOut.value) {
    return;
  }

  isLoggingOut.value = true;

  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' });
    await navigateTo('/admin/login');
  } finally {
    isLoggingOut.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-background text-foreground" :dir="direction">
    <div class="lg:hidden sticky top-0 z-40 border-b border-border bg-surface/92 px-4 py-3 backdrop-blur">
      <div class="flex items-center justify-between gap-3">
        <button class="sazan-focus rounded-full border border-border bg-background px-3 py-2 text-sm font-black" type="button" @click="isDrawerOpen = true">
          {{ t('admin.actions.menu') }}
        </button>
        <NuxtLink to="/admin" class="font-black tracking-[-0.04em] text-foreground">
          {{ t('admin.title') }}
        </NuxtLink>
        <ThemeSwitcher />
      </div>
    </div>

    <Transition name="admin-drawer">
      <div v-if="isDrawerOpen" class="fixed inset-0 z-50 lg:hidden">
        <button class="absolute inset-0 bg-foreground/35" type="button" :aria-label="t('admin.actions.close')" @click="isDrawerOpen = false" />
        <aside class="relative h-full w-[min(20rem,86vw)] border-e border-border bg-surface p-4 shadow-[var(--shadow-strong)]" role="dialog" aria-modal="true" :aria-label="t('admin.title')">
          <div class="mb-6 flex items-center justify-between">
            <span class="text-xl font-black">{{ t('admin.title') }}</span>
            <button class="sazan-focus rounded-full border border-border px-3 py-1 text-sm" type="button" @click="isDrawerOpen = false">
              {{ t('admin.actions.close') }}
            </button>
          </div>
          <nav class="grid gap-2" :aria-label="t('admin.nav.label')">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="sazan-focus flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition"
              :class="isActive(item.to) ? 'border-primary/45 bg-primary/10 text-primary' : 'border-transparent text-muted hover:border-border hover:bg-background hover:text-foreground'"
              @click="isDrawerOpen = false"
            >
              <span aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>
          <div class="mt-6 flex items-center justify-between rounded-2xl border border-border bg-background p-3">
            <span class="text-xs font-bold text-muted">{{ t('admin.actions.language') }}</span>
            <div class="flex rounded-full border border-border bg-surface p-1">
              <button
                v-for="item in localeOptions"
                :key="item"
                type="button"
                class="sazan-focus rounded-full px-3 py-1 text-xs font-black"
                :class="locale === item ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground'"
                @click="switchLocale(item)"
              >
                {{ item.toUpperCase() }}
              </button>
            </div>
          </div>
          <button class="sazan-button-secondary mt-4 w-full" type="button" :disabled="isLoggingOut" @click="logout">
            {{ isLoggingOut ? t('admin.states.loading') : t('admin.actions.logout') }}
          </button>
        </aside>
      </div>
    </Transition>

    <div class="mx-auto grid min-h-screen max-w-[104rem] lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside class="hidden border-e border-border bg-surface/72 px-4 py-5 lg:sticky lg:top-0 lg:block lg:h-screen">
        <div class="flex h-full flex-col">
          <NuxtLink to="/admin" class="sazan-focus rounded-3xl border border-border bg-background p-5 shadow-sm">
            <span class="sazan-meta">SAZAN</span>
            <span class="mt-2 block text-2xl font-black tracking-[-0.06em]">{{ t('admin.title') }}</span>
            <span class="mt-2 block text-xs leading-5 text-muted">{{ t('admin.subtitle') }}</span>
          </NuxtLink>

          <nav class="mt-6 grid gap-2" :aria-label="t('admin.nav.label')">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="sazan-focus flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition"
              :class="isActive(item.to) ? 'border-primary/45 bg-primary/10 text-primary' : 'border-transparent text-muted hover:border-border hover:bg-background hover:text-foreground'"
            >
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/20" aria-hidden="true">
                {{ item.icon }}
              </span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <div class="mt-auto grid gap-3 rounded-3xl border border-border bg-background p-4">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-muted">{{ t('admin.actions.language') }}</span>
              <div class="flex rounded-full border border-border bg-surface p-1">
                <button
                  v-for="item in localeOptions"
                  :key="item"
                  type="button"
                  class="sazan-focus rounded-full px-3 py-1 text-xs font-black"
                  :class="locale === item ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground'"
                  @click="switchLocale(item)"
                >
                  {{ item.toUpperCase() }}
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-muted">{{ t('admin.actions.theme') }}</span>
              <ThemeSwitcher />
            </div>
            <button class="sazan-button-secondary w-full" type="button" :disabled="isLoggingOut" @click="logout">
              {{ isLoggingOut ? t('admin.states.loading') : t('admin.actions.logout') }}
            </button>
          </div>
        </div>
      </aside>

      <main class="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div class="mb-6 flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="sazan-meta">{{ t('admin.eyebrow') }}</p>
            <h1 class="mt-2 text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
              {{ currentTitle }}
            </h1>
          </div>
          <div class="hidden items-center gap-3 lg:flex">
            <NuxtLink to="/" class="sazan-button-secondary">
              {{ t('admin.actions.viewSite') }}
            </NuxtLink>
          </div>
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-drawer-enter-active,
.admin-drawer-leave-active {
  transition: opacity 160ms ease;
}

.admin-drawer-enter-from,
.admin-drawer-leave-to {
  opacity: 0;
}
</style>
