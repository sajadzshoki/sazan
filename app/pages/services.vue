<script setup lang="ts">
import { services } from '~/data/home';
import { studioTechKeys } from '~/data/tech';

const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { formatDigits } = useLocaleDigits();
const siteUrl = computed(() => String(config.public.siteUrl || 'https://sazan.studio').replace(/\/$/, ''));

const serviceIcons: Record<(typeof services)[number]['key'], string> = {
  websites: 'M4 6.5h16v9.5H4zM8 19.5h8',
  webApps: 'M4 5h16v14H4zM4 9h16M9 13h6',
  mobileApps: 'M9 3.5h6a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1zM11 17.5h2',
  ecommerce: 'M6.5 8h11l-.8 11h-9.4zM9 8V6.5a3 3 0 0 1 6 0V8',
  adminPanels: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  backendSystems: 'M5 4h14v4.5H5zM5 10h14v4.5H5zM5 16h14v4H5zM8 6.2h.1M8 12.2h.1'
};

usePublicSeo({
  title: () => t('studio.servicesPage.seoTitle'),
  description: () => t('studio.servicesPage.seoDescription'),
  structuredData: () => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('studio.servicesPage.title'),
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t(`home.services.items.${service.key}.title`),
      description: t(`home.services.items.${service.key}.description`),
      url: `${siteUrl.value}${localePath('/services')}#${service.key}`
    }))
  })
});
</script>

<template>
  <div>
    <section class="page-intro border-b border-border">
      <BaseContainer>
        <p class="sazan-eyebrow">
          {{ t('studio.servicesPage.eyebrow') }}
        </p>
        <h1 class="page-intro-title">
          {{ t('studio.servicesPage.title') }}
        </h1>
        <p class="page-intro-lead">
          {{ t('studio.servicesPage.lead') }}
        </p>

        <p class="kicker mt-5">
          {{ t('studio.servicesPage.tools') }}
        </p>
        <ul class="mt-2.5 flex flex-wrap gap-2">
          <li v-for="tech in studioTechKeys" :key="tech">
            <TechMark :tech="tech" />
          </li>
        </ul>
      </BaseContainer>
    </section>

    <nav class="service-jump" :aria-label="t('studio.servicesPage.eyebrow')">
      <BaseContainer>
        <ul class="flex gap-2 overflow-x-auto py-3">
          <li v-for="service in services" :key="service.key">
            <a class="sazan-focus service-jump-link" :href="`#${service.key}`">
              <span>{{ formatDigits(service.index) }}</span>
              {{ t(`home.services.items.${service.key}.title`) }}
            </a>
          </li>
        </ul>
      </BaseContainer>
    </nav>

    <section class="py-10 sm:py-14">
      <BaseContainer>
        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="service in services"
            :id="service.key"
            :key="service.key"
            class="service-card"
          >
            <div class="flex items-center justify-between gap-4">
              <span class="service-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="serviceIcons[service.key]" />
                </svg>
              </span>
              <span class="service-index">{{ formatDigits(service.index) }}</span>
            </div>

            <h2 class="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-foreground">
              {{ t(`home.services.items.${service.key}.title`) }}
            </h2>
            <p class="mt-3 text-[0.98rem] leading-7 text-muted">
              {{ t(`home.services.items.${service.key}.description`) }}
            </p>

            <p class="kicker mt-6 text-subtle">
              {{ t('studio.servicesPage.builtWith') }}
            </p>
            <ul class="mt-2.5 flex flex-wrap gap-2">
              <li v-for="tech in service.logos" :key="tech">
                <TechMark :tech="tech" />
              </li>
            </ul>

            <ul v-if="service.technologies.length" class="mt-3 flex flex-wrap gap-2">
              <li v-for="technology in service.technologies" :key="technology" class="sazan-chip">
                {{ technology }}
              </li>
            </ul>
          </article>
        </div>

        <div class="service-close">
          <p class="max-w-xl text-lg font-semibold text-foreground">
            {{ t('studio.servicesPage.close') }}
          </p>
          <NuxtLink :to="localePath('/start-a-project')" class="sazan-button-primary w-full sm:w-max">
            {{ t('common.startProject') }}
            <span class="arrow-icon" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.service-jump {
  position: sticky;
  top: var(--header-height);
  z-index: 20;
  border-bottom: 1px solid rgb(var(--color-border));
  background: rgb(var(--color-background) / 0.9);
  backdrop-filter: blur(14px);
}

.service-jump ul {
  scrollbar-width: none;
}

.service-jump ul::-webkit-scrollbar {
  display: none;
}

.service-jump-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 2.15rem;
  padding-inline: 0.8rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 999px;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-foreground));
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.service-jump-link span {
  color: rgb(var(--color-primary));
  font-size: 0.68rem;
  letter-spacing: 0.04em;
}

.service-jump-link:hover {
  border-color: rgb(var(--color-primary) / 0.45);
}

.service-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem 1.15rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.35rem;
  background:
    radial-gradient(420px 180px at 100% 0%, rgb(var(--color-primary) / 0.08), transparent 60%),
    rgb(var(--color-surface));
  scroll-margin-top: calc(var(--header-height) + 4.25rem);
  transition: border-color 200ms var(--ease-studio), transform 200ms var(--ease-studio);
}

.service-card:hover {
  border-color: rgb(var(--color-primary) / 0.4);
}

.service-icon {
  display: grid;
  width: 2.6rem;
  height: 2.6rem;
  place-items: center;
  border-radius: 0.9rem;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}

.service-icon svg {
  width: 1.2rem;
  height: 1.2rem;
}

.service-index {
  color: rgb(var(--color-primary));
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.service-close {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 1.35rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.35rem;
  background: rgb(var(--color-surface));
}

@media (min-width: 640px) {
  .service-close {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.kicker {
  color: rgb(var(--color-primary));
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.kicker.text-subtle {
  color: rgb(var(--color-subtle));
  font-size: 0.68rem;
}

html[dir='rtl'] .kicker,
html[dir='rtl'] .service-index,
html[dir='rtl'] .service-jump-link span {
  letter-spacing: 0;
  text-transform: none;
}

html[dir='rtl'] .service-card {
  background:
    radial-gradient(420px 180px at 0% 0%, rgb(var(--color-primary) / 0.08), transparent 60%),
    rgb(var(--color-surface));
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }
}
</style>
