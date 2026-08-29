<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const route = useRoute();

const locale = computed(() => route.path.startsWith('/en') ? 'en' : 'fa');
const direction = computed(() => locale.value === 'fa' ? 'rtl' : 'ltr');
const language = computed(() => locale.value === 'fa' ? 'fa-IR' : 'en-US');
const isNotFound = computed(() => props.error.statusCode === 404);
const homePath = computed(() => `/${locale.value}`);
const projectsPath = computed(() => `/${locale.value}/projects`);
const title = computed(() => {
  if (locale.value === 'fa') {
    return isNotFound.value ? 'این صفحه پیدا نشد.' : 'مشکلی در سرور پیش آمد.';
  }

  return isNotFound.value ? 'This page was not found.' : 'Something went wrong.';
});
const description = computed(() => {
  if (locale.value === 'fa') {
    return isNotFound.value
      ? 'ممکن است آدرس تغییر کرده باشد یا صفحه‌ای که دنبال آن هستید دیگر در دسترس نباشد.'
      : 'درخواست شما کامل نشد. کمی بعد دوباره تلاش کنید یا از مسیرهای اصلی سایت ادامه دهید.';
  }

  return isNotFound.value
    ? 'The address may have changed or the page you are looking for is no longer available.'
    : 'The request could not be completed. Please try again shortly or continue from the main site routes.';
});
const homeLabel = computed(() => locale.value === 'fa' ? 'بازگشت به خانه' : 'Return home');
const projectsLabel = computed(() => locale.value === 'fa' ? 'دیدن پروژه‌ها' : 'View projects');
const eyebrow = computed(() => isNotFound.value ? '404' : '500');

useHead({
  htmlAttrs: {
    lang: language,
    dir: direction
  },
  title,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});

const recover = async (path: string) => {
  await clearError({ redirect: path });
};
</script>

<template>
  <main class="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8" :dir="direction">
    <div class="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl place-items-center">
      <section class="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 text-center shadow-[var(--shadow-strong)] sm:p-10 lg:p-14">
        <div class="absolute inset-0 grid-paper opacity-25" aria-hidden="true" />
        <div class="absolute -end-20 -top-20 h-72 w-72 rounded-full bg-primary/16 blur-3xl" aria-hidden="true" />
        <div class="relative z-10">
          <p class="sazan-eyebrow justify-center">
            {{ eyebrow }} · SAZAN
          </p>
          <h1 class="sazan-heading-xl mx-auto mt-7 max-w-3xl text-balance text-foreground">
            {{ title }}
          </h1>
          <p class="sazan-body-lg mx-auto mt-6 max-w-2xl text-pretty">
            {{ description }}
          </p>
          <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" class="sazan-button-primary" @click="recover(homePath)">
              {{ homeLabel }}
            </button>
            <button type="button" class="sazan-button-secondary" @click="recover(projectsPath)">
              {{ projectsLabel }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
