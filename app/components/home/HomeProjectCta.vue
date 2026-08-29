<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();

const startProjectPath = computed(() => localePath('/start-a-project'));
</script>

<template>
  <section id="project-cta" class="sazan-section">
    <BaseContainer>
      <div class="relative overflow-hidden border border-border bg-surface p-7 shadow-[var(--shadow-soft)] sm:p-10 lg:p-14">
        <div class="absolute inset-0 grid-paper opacity-28" aria-hidden="true" />
        <div class="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-primary/18 blur-3xl" aria-hidden="true" />
        <div class="relative z-10 grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-end lg:gap-10">
          <div>
            <p class="sazan-eyebrow">
              {{ t('home.cta.eyebrow') }}
            </p>
            <h2 class="sazan-heading-xl mt-6 max-w-4xl text-balance text-foreground">
              {{ t('home.cta.title') }}
            </h2>
            <p class="sazan-body-lg mt-6 max-w-2xl text-pretty">
              {{ t('home.cta.lead') }}
            </p>
          </div>

          <div class="grid gap-4 lg:justify-items-end">
            <NuxtLink :to="startProjectPath" class="sazan-button-primary w-full sm:w-max">
              {{ t('common.startProject') }}
            </NuxtLink>
            <p class="text-sm leading-6 text-muted lg:max-w-xs lg:text-end">
              {{ t('home.cta.note') }}
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
