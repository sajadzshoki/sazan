<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();

const homePath = computed(() => localePath('/'));
const startProjectPath = computed(() => `${homePath.value}#project-cta`);
const selectedWorkPath = computed(() => localePath('/projects'));
const metrics = ['products', 'disciplines', 'languages'] as const;
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <div class="absolute inset-x-0 top-0 -z-10 h-px bg-border" aria-hidden="true" />
    <BaseContainer>
      <div class="grid items-center gap-12 py-14 md:py-16 lg:min-h-[calc(100svh-var(--header-height)-3.5rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-18">
        <div class="max-w-5xl">
          <p class="sazan-eyebrow motion-fade-up">
            {{ t('home.hero.eyebrow') }}
          </p>

          <h1 class="sazan-display motion-fade-up motion-delay-1 mt-7 max-w-5xl text-balance text-foreground sm:mt-8">
            {{ t('home.hero.title') }}
          </h1>

          <div class="motion-fade-up motion-delay-2 mt-7 grid gap-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(14rem,0.26fr)] lg:items-end lg:gap-7">
            <p class="sazan-body-lg max-w-2xl text-pretty">
              {{ t('home.hero.lead') }}
            </p>

            <div class="grid gap-2 border-s border-border ps-5 text-sm text-muted">
              <span class="font-bold text-foreground">{{ t('home.hero.signalTitle') }}</span>
              <span>{{ t('home.hero.signalText') }}</span>
            </div>
          </div>

          <div class="motion-fade-up motion-delay-3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <a :href="startProjectPath" class="sazan-button-primary">
              {{ t('common.startProject') }}
            </a>
            <a :href="selectedWorkPath" class="sazan-button-secondary">
              {{ t('common.exploreWork') }}
            </a>
          </div>
        </div>

        <div class="motion-fade-up motion-delay-2 relative lg:justify-self-end">
          <div class="hero-visual hero-visual-float relative aspect-[0.92] min-h-[22rem] w-full max-w-[34rem] overflow-hidden rounded-[1.75rem] p-5 sm:aspect-[0.86] sm:min-h-[27rem] sm:rounded-[2rem] sm:p-7 lg:min-h-[28rem]">
            <div class="absolute inset-0 grid-paper opacity-35" aria-hidden="true" />
            <div class="relative z-10 flex h-full flex-col justify-between">
              <div class="flex items-start justify-between gap-5">
                <div>
                  <p class="sazan-meta">{{ t('home.hero.visual.kicker') }}</p>
                  <p class="mt-3 max-w-[16rem] text-2xl font-black leading-none tracking-[-0.06em] text-foreground sm:text-3xl sm:tracking-[-0.08em]">
                    {{ t('home.hero.visual.title') }}
                  </p>
                </div>
                <div class="grid h-16 w-16 place-items-center rounded-full border border-border bg-background/70 text-sm font-black text-primary">
                  {{ t('home.hero.visual.badge') }}
                </div>
              </div>

              <div class="grid gap-3">
                <div class="hero-panel-line h-px w-full" />
                <div class="grid grid-cols-6 gap-2">
                  <span v-for="item in 18" :key="item" class="h-10 border border-border/80 bg-background/42" />
                </div>
              </div>

              <div class="grid gap-3 rounded-2xl border border-border bg-surface/86 p-4 shadow-[var(--shadow-soft)]">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-xs font-black text-muted">{{ t('home.hero.visual.module') }}</span>
                  <span class="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                </div>
                <div class="grid gap-2">
                  <span class="h-3 w-11/12 rounded-full bg-foreground/14" />
                  <span class="h-3 w-8/12 rounded-full bg-primary/45" />
                  <span class="h-3 w-10/12 rounded-full bg-foreground/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid border-y border-border py-5 sm:grid-cols-3">
        <div
          v-for="metric in metrics"
          :key="metric"
          class="flex items-baseline justify-between gap-5 border-border py-4 sm:block sm:border-s sm:px-6 sm:first:border-s-0"
        >
          <p class="text-3xl font-black tracking-[-0.06em] text-foreground">
            {{ t(`home.hero.metrics.${metric}.value`) }}
          </p>
          <p class="mt-2 text-sm leading-6 text-muted">
            {{ t(`home.hero.metrics.${metric}.label`) }}
          </p>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
