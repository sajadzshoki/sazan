<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';
import { screenshotFor } from '~/utils/presentation';

defineProps<{
  projects: LocalizedPortfolioProject[];
}>();

const localePath = useLocalePath();
const { t } = useI18n();
</script>

<template>
  <section v-if="projects.length" class="sazan-section-tight border-t border-border">
    <BaseContainer>
      <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="sazan-eyebrow">
            {{ t('portfolio.detail.related.eyebrow') }}
          </p>
          <h2 class="sazan-heading-lg mt-4 text-foreground">
            {{ t('portfolio.detail.related.title') }}
          </h2>
        </div>
        <NuxtLink :to="localePath('/projects')" class="sazan-text-link w-max text-sm">
          {{ t('portfolio.detail.backToProjects') }}
        </NuxtLink>
      </div>

      <div class="mt-10 grid gap-8 md:grid-cols-3">
        <article v-for="project in projects" :key="project.slug">
          <NuxtLink
            :to="localePath(`/projects/${project.slug}`)"
            class="group sazan-focus block"
          >
            <DeviceFrame
              :type="project.category === 'mobileApps' ? 'phone' : 'laptop'"
              :src="screenshotFor(project.media, project.category === 'mobileApps' ? 'phone' : 'laptop')"
              :alt="project.title"
              :title="project.title"
              :caption="t(`portfolio.categories.${project.category}`)"
            />
            <h3 class="mt-4 text-xl font-extrabold text-foreground">
              {{ project.title }}
            </h3>
            <p class="mt-2 text-sm leading-7 text-muted">
              {{ project.shortDescription }}
            </p>
          </NuxtLink>
          <NuxtLink
            :to="localePath({ path: '/start-a-project', query: { similar: project.slug } })"
            class="sazan-button-secondary mt-4"
          >
            {{ t('portfolio.similar.action') }}
          </NuxtLink>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>
