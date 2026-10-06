<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';

const props = defineProps<{
  project: LocalizedPortfolioProject;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const { formatDigits } = useLocaleDigits();

const timelineText = computed(() => {
  if (!props.project.timeline) {
    return t('portfolio.detail.notSpecified');
  }

  return props.project.timeline.note || t('portfolio.detail.weeks', {
    count: formatDigits(props.project.timeline.durationWeeks || 0)
  });
});

const pricingText = computed(() => {
  const pricing = props.project.pricing;

  if (!pricing) {
    return '';
  }

  if (pricing.note) {
    return pricing.note;
  }

  if (pricing.visibility === 'private') {
    return t('portfolio.detail.pricing.private');
  }

  if (pricing.visibility === 'on-request') {
    return t('portfolio.detail.pricing.onRequest');
  }

  return t('portfolio.detail.pricing.public');
});

const details = computed(() => {
  const baseDetails: Array<{ label: string; value?: string; services?: boolean }> = [
    { label: t('portfolio.detail.meta.category'), value: t(`portfolio.categories.${props.project.category}`) },
    { label: t('portfolio.detail.meta.services'), services: true },
    { label: t('portfolio.detail.meta.timeline'), value: timelineText.value },
    { label: t('portfolio.detail.meta.year'), value: formatDigits(props.project.year) }
  ];

  if (pricingText.value) {
    baseDetails.push({ label: t('portfolio.detail.meta.pricing'), value: pricingText.value });
  }

  return baseDetails;
});
</script>

<template>
  <aside class="sazan-surface p-5 shadow-[var(--shadow-soft)] lg:p-6">
    <h2 class="sazan-meta text-foreground">
      {{ t('portfolio.detail.projectDetails') }}
    </h2>

    <dl class="mt-6 grid gap-5">
      <div v-for="item in details" :key="item.label" class="border-t border-border pt-4 first:border-t-0 first:pt-0">
        <dt class="sazan-meta">
          {{ item.label }}
        </dt>
        <dd class="mt-2 text-base font-bold leading-7 text-foreground">
          <template v-if="item.services">
            <template v-for="(service, index) in project.services" :key="service">
              <span v-if="index > 0"> / </span>
              <NuxtLink :to="localePath(`/services#${service}`)" class="sazan-focus">
                {{ t(`home.services.items.${service}.title`) }}
              </NuxtLink>
            </template>
          </template>
          <template v-else>
            {{ item.value }}
          </template>
        </dd>
      </div>
    </dl>
  </aside>
</template>
