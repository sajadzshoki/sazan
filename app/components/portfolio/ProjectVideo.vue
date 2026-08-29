<script setup lang="ts">
import type { LocalizedPortfolioVideo } from '~/composables/usePortfolio';

const props = defineProps<{
  video: LocalizedPortfolioVideo;
}>();

const { t } = useI18n();
</script>

<template>
  <section class="sazan-section-tight border-y border-border bg-surface/42">
    <BaseContainer>
      <div class="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-center lg:gap-10">
        <div>
          <p class="sazan-eyebrow">
            {{ t('portfolio.detail.video.eyebrow') }}
          </p>
          <h2 class="sazan-heading-lg mt-5 text-balance text-foreground">
            {{ props.video.title }}
          </h2>
          <p class="sazan-body-lg mt-5 text-pretty">
            {{ props.video.description }}
          </p>
        </div>

        <div class="relative min-h-[18rem] overflow-hidden border border-border bg-background shadow-[var(--shadow-soft)] sm:min-h-[22rem]">
          <div class="portfolio-grain absolute inset-0 opacity-50" aria-hidden="true" />
          <div class="absolute inset-6 border border-border" aria-hidden="true" />
          <div class="absolute inset-0 grid place-items-center p-8 text-center">
            <div class="grid justify-items-center gap-5">
              <span class="grid h-20 w-20 place-items-center rounded-full border border-primary bg-primary/10 text-2xl text-primary" aria-hidden="true">
                ▶
              </span>
              <div>
                <p class="sazan-meta">
                  {{ props.video.label }}
                </p>
                <p class="mt-3 max-w-sm text-sm leading-7 text-muted">
                  {{ t('portfolio.detail.video.placeholder') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
