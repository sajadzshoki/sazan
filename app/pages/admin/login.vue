<script setup lang="ts">
defineI18nRoute(false);
definePageMeta({
  layout: false
});

const route = useRoute();
const { t, locale, setLocaleCookie } = useI18n();
const { direction } = useAppDirection();

const localeOptions = ['fa', 'en'] as const;
const credentials = reactive({
  email: '',
  password: ''
});
const isSubmitting = ref(false);
const errorMessage = ref('');

const { data: session } = await useFetch('/api/admin/auth/session');

const switchLocale = (targetLocale: 'fa' | 'en') => {
  locale.value = targetLocale;
  setLocaleCookie(targetLocale);
};

const submit = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: credentials
    });

    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
      ? route.query.redirect
      : '/admin';

    await navigateTo(redirect);
  } catch {
    errorMessage.value = t('admin.login.invalid');
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: () => t('admin.login.title')
});
</script>

<template>
  <main class="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6" :dir="direction">
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
      <section class="grid w-full overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-strong)] lg:grid-cols-[0.92fr_1.08fr]">
        <div class="border-b border-border bg-foreground p-8 text-background sm:p-10 lg:border-b-0 lg:border-e">
          <p class="sazan-meta text-background/70">SAZAN</p>
          <h1 class="mt-6 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
            {{ t('admin.login.heroTitle') }}
          </h1>
          <p class="mt-5 max-w-md text-base leading-8 text-background/72">
            {{ t('admin.login.heroLead') }}
          </p>
          <div class="mt-8 rounded-2xl border border-background/15 bg-background/8 p-4 text-sm leading-7 text-background/72">
            {{ t('admin.login.securityNote') }}
          </div>
        </div>

        <div class="p-6 sm:p-9 lg:p-10">
          <div class="mb-8 flex items-center justify-between gap-3">
            <div>
              <p class="sazan-meta">{{ t('admin.login.eyebrow') }}</p>
              <h2 class="mt-2 text-2xl font-black tracking-[-0.04em]">
                {{ t('admin.login.title') }}
              </h2>
            </div>
            <div class="flex rounded-full border border-border bg-background p-1">
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

          <div v-if="session && !session.configured" class="mb-5 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm leading-7 text-primary">
            {{ t('admin.login.notConfigured') }}
          </div>

          <form class="grid gap-5" @submit.prevent="submit">
            <label class="grid gap-2 text-sm font-bold">
              <span>{{ t('admin.fields.email') }}</span>
              <input v-model="credentials.email" autocomplete="username" type="email" class="admin-input" required>
            </label>

            <label class="grid gap-2 text-sm font-bold">
              <span>{{ t('admin.fields.password') }}</span>
              <input v-model="credentials.password" autocomplete="current-password" type="password" class="admin-input" required>
            </label>

            <p v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-bold text-red-500">
              {{ errorMessage }}
            </p>

            <button class="sazan-button-primary w-full" type="submit" :disabled="isSubmitting || (session && !session.configured)">
              {{ isSubmitting ? t('admin.states.loading') : t('admin.login.submit') }}
            </button>
          </form>
        </div>
      </section>
    </div>
  </main>
</template>
