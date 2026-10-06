<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';
import { screenshotFor } from '~/utils/presentation';

const props = defineProps<{
  project: LocalizedPortfolioProject;
  index: number;
}>();

const localePath = useLocalePath();
const { t } = useI18n();
const { formatDigits } = useLocaleDigits();

const projectPath = computed(() => localePath(`/projects/${props.project.slug}`));
const similarPath = computed(() => localePath({
  path: '/start-a-project',
  query: { similar: props.project.slug }
}));
const displayIndex = computed(() => formatDigits(String(props.index + 1).padStart(2, '0')));
const displayYear = computed(() => formatDigits(props.project.year));
const projectCategoryLabel = computed(() => t(`portfolio.categories.${props.project.category}`));
const device = computed(() => props.project.category === 'mobileApps' ? 'phone' as const : 'laptop' as const);
</script>

<template>
  <article class="scroll-reveal">
    <NuxtLink
      :to="projectPath"
      class="group sazan-focus block"
      :aria-label="t('portfolio.card.openProject', { title: project.title })"
    >
      <DeviceFrame
        :type="device"
        :src="screenshotFor(project.media, device)"
        :alt="project.title"
        :title="project.title"
        :caption="projectCategoryLabel"
      />

      <div class="mt-5 border-t border-border pt-4">
        <p class="sazan-meta">
          {{ displayIndex }} · {{ projectCategoryLabel }} · {{ displayYear }}
        </p>
        <h2 class="sazan-title-tight mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
          {{ project.title }}
        </h2>
        <p class="mt-3 text-sm leading-7 text-muted">
          {{ project.shortDescription }}
        </p>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li v-for="technology in project.technologies.slice(0, 4)" :key="technology" class="sazan-chip">
            {{ technology }}
          </li>
        </ul>
      </div>
    </NuxtLink>
    <NuxtLink :to="similarPath" class="sazan-button-secondary mt-4">
      {{ t('portfolio.similar.action') }}
    </NuxtLink>
  </article>
</template>
