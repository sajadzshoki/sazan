<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';

const props = defineProps<{
  project: LocalizedPortfolioProject;
  index: number;
}>();

const localePath = useLocalePath();
const { t } = useI18n();
const { formatDigits } = useLocaleDigits();

const projectPath = computed(() => localePath(`/projects/${props.project.slug}`));
const displayIndex = computed(() => formatDigits(String(props.index + 1).padStart(2, '0')));
const displayYear = computed(() => formatDigits(props.project.year));
const projectCategoryLabel = computed(() => t(`portfolio.categories.${props.project.category}`));
const visualLabel = computed(() => `${displayIndex.value} · ${projectCategoryLabel.value} · ${displayYear.value}`);

const articleClass = computed(() => {
  switch (props.project.layout) {
    case 'feature':
      return 'lg:col-span-8';
    case 'portrait':
      return 'lg:col-span-4 lg:row-span-2';
    case 'landscape':
      return 'lg:col-span-7';
    default:
      return 'lg:col-span-5';
  }
});

const visualClass = computed(() => {
  switch (props.project.layout) {
    case 'feature':
      return 'min-h-[28rem]';
    case 'portrait':
      return 'min-h-[34rem]';
    case 'landscape':
      return 'min-h-[23rem]';
    default:
      return 'min-h-[21rem]';
  }
});
</script>

<template>
  <article class="scroll-reveal" :class="articleClass">
    <NuxtLink
      :to="projectPath"
      class="group sazan-focus block rounded-[1.8rem]"
      :aria-label="$t('portfolio.card.openProject', { title: project.title })"
    >
      <PortfolioVisual
        :visual="project.coverVisual"
        :label="visualLabel"
        :title="project.title"
        :class="visualClass"
      />

      <div class="mt-5 grid gap-5 border-t border-border pt-5 md:grid-cols-[1fr_auto]">
        <div>
          <p class="sazan-meta">
            {{ projectCategoryLabel }}
          </p>
          <h2 class="sazan-title-tight mt-3 text-3xl font-black text-foreground sm:text-4xl">
            {{ project.title }}
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-7 text-muted">
            {{ project.shortDescription }}
          </p>
        </div>

        <div class="grid gap-4 md:justify-items-end md:text-end">
          <ul class="flex flex-wrap gap-2 md:max-w-[17rem] md:justify-end">
            <li
              v-for="technology in project.technologies.slice(0, 4)"
              :key="technology"
              class="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-muted transition group-hover:border-primary/45 group-hover:text-foreground"
            >
              {{ technology }}
            </li>
          </ul>

          <span class="sazan-text-link w-max">
            {{ t('common.viewCaseStudy') }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
