<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';

const props = defineProps<{
  projects: LocalizedPortfolioProject[];
}>();

const localePath = useLocalePath();
const { t } = useI18n();

const getCategoryLabel = (category: LocalizedPortfolioProject['category']) => t(`portfolio.categories.${category}`);
</script>

<template>
  <section class="sazan-section">
    <BaseContainer>
      <div class="flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          :eyebrow="t('portfolio.detail.related.eyebrow')"
          :title="t('portfolio.detail.related.title')"
          :lead="t('portfolio.detail.related.lead')"
        />
        <NuxtLink :to="localePath('/projects')" class="sazan-text-link w-max">
          {{ t('portfolio.detail.backToProjects') }}
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-3">
        <NuxtLink
          v-for="project in props.projects"
          :key="project.slug"
          :to="localePath(`/projects/${project.slug}`)"
          class="group sazan-focus block rounded-[1.35rem]"
        >
          <PortfolioVisual
            :visual="project.coverVisual"
            :label="getCategoryLabel(project.category)"
            :title="project.title"
            compact
          />
          <h3 class="sazan-title-tight mt-5 text-2xl font-black text-foreground">
            {{ project.title }}
          </h3>
          <p class="mt-3 text-sm leading-7 text-muted">
            {{ project.shortDescription }}
          </p>
        </NuxtLink>
      </div>
    </BaseContainer>
  </section>
</template>
