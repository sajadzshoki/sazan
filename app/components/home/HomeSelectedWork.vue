<script setup lang="ts">
import { featuredProjects } from '~/data/home';

const localePath = useLocalePath();
const { t } = useI18n();
const selectedWorkPath = computed(() => localePath('/projects'));
</script>

<template>
  <section id="selected-work" class="sazan-section">
    <BaseContainer>
      <div class="grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
        <SectionHeading
          :eyebrow="t('home.selectedWork.eyebrow')"
          :title="t('home.selectedWork.title')"
          :lead="t('home.selectedWork.lead')"
        />

        <div class="lg:justify-self-end">
          <a :href="selectedWorkPath" class="sazan-text-link">
            {{ t('common.viewAllProjects') }}
          </a>
          <p class="mt-4 max-w-xs text-sm leading-6 text-muted">
            {{ t('home.selectedWork.note') }}
          </p>
        </div>
      </div>

      <div class="mt-14 grid gap-x-8 gap-y-14 lg:grid-cols-2">
        <HomeProjectCard
          v-for="(project, index) in featuredProjects"
          :key="project.key"
          :project="project"
          :index="index"
        />
      </div>
    </BaseContainer>
  </section>
</template>
