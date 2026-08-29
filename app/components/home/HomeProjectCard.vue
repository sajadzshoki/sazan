<script setup lang="ts">
import type { FeaturedProject } from '~/data/home';

const props = defineProps<{
  project: FeaturedProject;
  index: number;
}>();

const localePath = useLocalePath();
const { t } = useI18n();
const { formatDigits } = useLocaleDigits();

const isWide = computed(() => props.project.layout === 'wide');
const isTall = computed(() => props.project.layout === 'tall');
const displayIndex = computed(() => formatDigits(String(props.index + 1).padStart(2, '0')));
const displayYear = computed(() => formatDigits(props.project.year));
const projectTitle = computed(() => t(`home.selectedWork.projects.${props.project.key}.title`));
const projectPath = computed(() => localePath(`/projects/${props.project.slug}`));
</script>

<template>
  <article
    class="group scroll-reveal relative grid gap-5 border-t border-border pt-5"
    :class="[
      isWide ? 'lg:col-span-2' : '',
      isTall ? 'lg:row-span-2' : ''
    ]"
  >
    <NuxtLink
      :to="projectPath"
      class="sazan-focus absolute inset-0 z-20 rounded-[1.6rem]"
      :aria-label="$t('portfolio.card.openProject', { title: projectTitle })"
    />

    <div class="project-visual rounded-[1.6rem]" :data-tone="project.tone">
      <div class="absolute inset-x-6 top-6 z-10 flex items-center justify-between text-xs font-black text-muted">
        <span>{{ t(`home.selectedWork.projects.${project.key}.category`) }}</span>
        <span>{{ displayYear }}</span>
      </div>

      <div class="absolute bottom-7 left-7 right-7 z-10 grid gap-3 rounded-2xl border border-border bg-background/84 p-4 backdrop-blur-sm">
        <div class="flex items-center justify-between gap-4">
          <span class="sazan-meta">{{ t('home.selectedWork.projectLabel', { number: displayIndex }) }}</span>
          <span class="text-xs text-primary">↗</span>
        </div>
        <div class="grid grid-cols-3 gap-2" aria-hidden="true">
          <span class="h-2 rounded-full bg-foreground/15" />
          <span class="h-2 rounded-full bg-primary/45" />
          <span class="h-2 rounded-full bg-accent/35" />
        </div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <h3 class="sazan-title-tight text-2xl font-black text-foreground sm:text-3xl">
          {{ t(`home.selectedWork.projects.${project.key}.title`) }}
        </h3>
        <p class="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          {{ t(`home.selectedWork.projects.${project.key}.description`) }}
        </p>
      </div>

      <ul class="flex flex-wrap gap-2 sm:max-w-[15rem] sm:justify-end">
        <li
          v-for="technology in project.technologies"
          :key="technology"
          class="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-muted transition group-hover:border-primary/40 group-hover:text-foreground"
        >
          {{ technology }}
        </li>
      </ul>
    </div>
  </article>
</template>
