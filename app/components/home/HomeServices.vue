<script setup lang="ts">
import { services } from '~/data/home';

const localePath = useLocalePath();

const icons: Record<string, string> = {
  websites: 'M4 6h16v12H4z M4 10h16',
  webApps: 'M5 5h6v6H5z M13 5h6v6h-6z M5 13h6v6H5z M13 13h6v6h-6z',
  mobileApps: 'M8 3h8v18H8z M11 18h2',
  ecommerce: 'M5 7h14l-1.2 11H6.2z M9 7V5a3 3 0 0 1 6 0v2',
  adminPanels: 'M4 5h16v4H4z M4 11h7v8H4z M13 11h7v8h-7z',
  backendSystems: 'M5 7h14v4H5z M5 13h14v4H5z M8 9h.01 M8 15h.01'
};
</script>

<template>
  <section id="services" class="sazan-section">
    <BaseContainer>
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <p class="sazan-eyebrow">
            {{ $t('studio.services.eyebrow') }}
          </p>
          <h2 class="sazan-heading-xl mt-5 text-balance text-foreground">
            {{ $t('studio.services.title') }}
          </h2>
          <p class="sazan-body-lg mt-5 text-pretty">
            {{ $t('studio.services.lead') }}
          </p>
        </div>
        <NuxtLink :to="localePath('/services')" class="sazan-text-link w-max text-sm">
          {{ $t('studio.services.all') }}
          <span class="arrow-icon" aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="service in services"
          :key="service.key"
          :to="localePath(`/services#${service.key}`)"
          class="group sazan-focus flex min-h-56 flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-0.5 hover:border-primary/45"
        >
          <div class="flex items-start justify-between gap-4">
            <svg class="h-7 w-7 text-primary transition duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <path :d="icons[service.key]" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="service-index text-sm">{{ service.index }}</span>
          </div>
          <div>
            <h3 class="text-xl font-extrabold text-foreground">
              {{ $t(`home.services.items.${service.key}.title`) }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-muted">
              {{ $t(`home.services.items.${service.key}.description`) }}
            </p>
            <p class="mt-4 text-sm font-semibold text-primary">
              <span class="arrow-icon" aria-hidden="true">→</span>
            </p>
          </div>
        </NuxtLink>
      </div>
    </BaseContainer>
  </section>
</template>
