<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';

const props = defineProps<{
  project: LocalizedPortfolioProject;
}>();

const { t } = useI18n();
const { formatDigits } = useLocaleDigits();

const servicesText = computed(() => props.project.services
  .map((service) => t(`home.services.items.${service}.title`))
  .join(' / '));

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
  const baseDetails = [
    { label: t('portfolio.detail.meta.category'), value: t(`portfolio.categories.${props.project.category}`) },
    { label: t('portfolio.detail.meta.services'), value: servicesText.value },
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
  <aside class="border border-border bg-surface p-5 shadow-[var(--shadow-soft)] lg:p-6">
    <h2 class="sazan-meta text-foreground">
      {{ t('portfolio.detail.projectDetails') }}
    </h2>

    <dl class="mt-6 grid gap-5">
      <div v-for="item in details" :key="item.label" class="border-t border-border pt-4 first:border-t-0 first:pt-0">
        <dt class="text-xs font-bold uppercase tracking-[0.12em] text-muted">
          {{ item.label }}
        </dt>
        <dd class="mt-2 text-base font-bold leading-7 text-foreground">
          {{ item.value }}
        </dd>
      </div>
    </dl>
  </aside>
</template>
