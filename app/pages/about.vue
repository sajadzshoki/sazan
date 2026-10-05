<script setup lang="ts">
import { processSteps, services } from '~/data/home';

const { t } = useI18n();
const localePath = useLocalePath();
const { projects } = usePortfolio();
const { formatDigits } = useLocaleDigits();
const catalogCount = computed(() => formatDigits(projects.value.length));

const facets = [
  { key: 'touch', icon: 'M4 6h16v10H4zM8 19h8' },
  { key: 'system', icon: 'M5 4h14v4.5H5zM5 10h14v4.5H5zM5 16h14v4H5z' }
] as const;

const stays = ['interface', 'data', 'access', 'checkout', 'release'] as const;

const serviceIcons: Record<(typeof services)[number]['key'], string> = {
  websites: 'M4 6.5h16v9.5H4zM8 19.5h8',
  webApps: 'M4 5h16v14H4zM4 9h16M9 13h6',
  mobileApps: 'M9 3.5h6a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1zM11 17.5h2',
  ecommerce: 'M6.5 8h11l-.8 11h-9.4zM9 8V6.5a3 3 0 0 1 6 0V8',
  adminPanels: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  backendSystems: 'M5 4h14v4.5H5zM5 10h14v4.5H5zM5 16h14v4H5z'
};

usePublicSeo({
  title: () => t('studio.about.seoTitle'),
  description: () => t('studio.about.seoDescription')
});
</script>

<template>
  <div>
    <section class="border-b border-border pt-12 pb-10 sm:pt-16">
      <BaseContainer>
        <p class="sazan-eyebrow">
          {{ t('studio.about.eyebrow') }}
        </p>
        <h1 class="about-title mt-5 max-w-3xl text-balance text-foreground">
          {{ t('studio.about.title') }}
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-pretty text-muted">
          {{ t('studio.about.lead') }}
        </p>

        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <article v-for="facet in facets" :key="facet.key" class="facet-card">
            <span class="facet-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path :d="facet.icon" />
              </svg>
            </span>
            <p>{{ t(`studio.about.facets.${facet.key}`) }}</p>
          </article>
        </div>

        <ul class="mt-4 flex flex-wrap gap-2">
          <li class="about-chip">{{ t('studio.about.facets.notCampaign') }}</li>
          <li class="about-chip">{{ t('studio.about.facets.notTickets') }}</li>
        </ul>
      </BaseContainer>
    </section>

    <section class="py-12 sm:py-16">
      <BaseContainer>
        <div class="about-panel">
          <div class="max-w-xl">
            <h2 class="text-3xl font-extrabold tracking-[-0.03em] text-balance text-foreground">
              {{ t('studio.about.practiceTitle') }}
            </h2>
            <p class="mt-4 text-base leading-7 text-muted">
              {{ t('studio.about.practiceLead') }}
            </p>
            <ul class="mt-5 flex flex-wrap gap-2">
              <li v-for="item in stays" :key="item" class="about-chip">
                {{ t(`studio.about.stays.${item}`) }}
              </li>
            </ul>
          </div>

          <ol class="practice-path">
            <li v-for="step in processSteps" :key="step.key">
              <span>{{ formatDigits(step.index) }}</span>
              {{ t(`home.process.steps.${step.key}.title`) }}
            </li>
          </ol>
        </div>
      </BaseContainer>
    </section>

    <section class="border-t border-border py-12 sm:py-16">
      <BaseContainer>
        <div class="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 class="text-3xl font-extrabold tracking-[-0.03em] text-balance text-foreground">
              {{ t('studio.about.languageTitle') }}
            </h2>
            <p class="mt-4 max-w-md text-base leading-7 text-muted">
              {{ t('studio.about.languageLead') }}
            </p>
          </div>

          <div class="language-pair" aria-hidden="true">
            <div class="language-card" dir="rtl">
              <span>فا</span>
              <strong>سازان</strong>
            </div>
            <div class="language-card" dir="ltr">
              <span>EN</span>
              <strong>SAZAN</strong>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section class="border-t border-border py-12 sm:py-16">
      <BaseContainer>
        <p class="text-sm font-bold text-primary">
          {{ t('studio.about.catalogLabel', { count: catalogCount }) }}
        </p>
        <ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="service in services" :key="service.key">
            <NuxtLink :to="localePath(`/services#${service.key}`)" class="sazan-focus service-link">
              <span class="facet-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="serviceIcons[service.key]" />
                </svg>
              </span>
              <span class="min-w-0">
                <span class="block text-xs font-bold text-primary">{{ formatDigits(service.index) }}</span>
                <span class="mt-1 block font-extrabold text-foreground">{{ t(`home.services.items.${service.key}.title`) }}</span>
              </span>
              <span class="arrow-icon ms-auto text-primary" aria-hidden="true">→</span>
            </NuxtLink>
          </li>
        </ul>

        <div class="about-close">
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
.about-title {
  font-size: clamp(1.85rem, 3.4vw, 3.15rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.facet-card,
.service-link,
.language-card,
.about-panel,
.about-close {
  border: 1px solid rgb(var(--color-border));
  background: rgb(var(--color-surface));
}

.facet-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  border-radius: 1.15rem;
}

.facet-card p {
  color: rgb(var(--color-foreground));
  font-size: 1.05rem;
  font-weight: 800;
}

.facet-icon {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: none;
  place-items: center;
  border-radius: 0.8rem;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}

.facet-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.about-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding-inline: 0.75rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 999px;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-muted));
  font-size: 0.82rem;
  font-weight: 700;
}

.about-panel {
  display: grid;
  gap: 1.75rem;
  padding: 1.35rem;
  border-radius: 1.4rem;
  background:
    radial-gradient(480px 200px at 100% 0%, rgb(var(--color-primary) / 0.1), transparent 62%),
    rgb(var(--color-surface));
}

.practice-path {
  display: grid;
  gap: 0.65rem;
}

.practice-path li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: rgb(var(--color-foreground));
  font-weight: 800;
}

.practice-path span {
  display: grid;
  width: 2.2rem;
  height: 2.2rem;
  flex: none;
  place-items: center;
  border: 1px solid rgb(var(--color-primary) / 0.4);
  border-radius: 999px;
  background: rgb(var(--color-background));
  color: rgb(var(--color-primary));
  font-size: 0.72rem;
}

.language-pair {
  display: grid;
  gap: 0.75rem;
}

.language-card {
  padding: 1.1rem 1.15rem;
  border-radius: 1.15rem;
}

.language-card span {
  color: rgb(var(--color-primary));
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.language-card strong {
  display: block;
  margin-top: 0.35rem;
  color: rgb(var(--color-foreground));
  font-size: 1.7rem;
  font-weight: 800;
}

.service-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-height: 5.2rem;
  padding: 0.85rem;
  border-radius: 1.1rem;
}

.service-link:hover {
  border-color: rgb(var(--color-primary) / 0.45);
}

.about-close {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
}

@media (min-width: 640px) {
  .about-close {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 900px) {
  .about-panel,
  .language-pair {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  .about-panel {
    padding: 1.7rem;
  }
}

html[dir='rtl'] .about-title,
html[dir='rtl'] .language-card span {
  letter-spacing: 0;
}

html[dir='rtl'] .about-title {
  line-height: 1.4;
  font-size: clamp(1.7rem, 3vw, 2.7rem);
}

html[dir='rtl'] .about-panel {
  background:
    radial-gradient(480px 200px at 0% 0%, rgb(var(--color-primary) / 0.1), transparent 62%),
    rgb(var(--color-surface));
}
</style>
