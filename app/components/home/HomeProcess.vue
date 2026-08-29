<script setup lang="ts">
import { processSteps } from '~/data/home';

const { t } = useI18n();
const { formatDigits } = useLocaleDigits();
</script>

<template>
  <section id="process" class="sazan-section">
    <BaseContainer>
      <SectionHeading
        :eyebrow="t('home.process.eyebrow')"
        :title="t('home.process.title')"
        :lead="t('home.process.lead')"
      />

      <div class="relative mt-14 grid gap-7 md:grid-cols-4">
        <article
          v-for="step in processSteps"
          :key="step.key"
          class="process-step relative grid gap-5 ps-14 md:ps-0 md:pt-16"
        >
          <div class="absolute start-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full border border-primary bg-background text-xs font-black text-primary md:top-0">
            {{ formatDigits(step.index) }}
          </div>
          <div>
            <h3 class="sazan-title-tight text-2xl font-black text-foreground">
              {{ t(`home.process.steps.${step.key}.title`) }}
            </h3>
            <p class="mt-3 text-sm leading-7 text-muted">
              {{ t(`home.process.steps.${step.key}.description`) }}
            </p>
          </div>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>
