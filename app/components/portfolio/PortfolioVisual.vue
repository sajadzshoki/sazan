<script setup lang="ts">
import type { PortfolioVisual } from '~/data/projects';

withDefaults(defineProps<{
  visual: PortfolioVisual;
  label?: string;
  title?: string;
  compact?: boolean;
}>(), {
  label: '',
  title: '',
  compact: false
});
</script>

<template>
  <div
    class="portfolio-visual"
    :class="compact ? 'min-h-64 rounded-[1.35rem]' : 'rounded-[1.8rem]'"
    :data-tone="visual.tone"
    :data-composition="visual.composition"
  >
    <div class="portfolio-grain absolute inset-0 opacity-55" aria-hidden="true" />
    <div class="absolute inset-x-5 top-5 z-10 flex items-center justify-between gap-4 text-xs font-black text-muted">
      <span>{{ label }}</span>
      <span class="inline-flex items-center gap-1 text-primary">
        <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        <span>SZN</span>
      </span>
    </div>

    <div class="absolute bottom-5 left-5 right-5 z-10 grid gap-3 border border-border bg-background/82 p-4 backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
      <p class="sazan-title-tight max-w-sm text-xl font-black text-foreground sm:text-2xl">
        {{ title }}
      </p>
      <div class="grid grid-cols-4 gap-2" aria-hidden="true">
        <span class="h-2 rounded-full bg-primary/50" />
        <span class="h-2 rounded-full bg-foreground/14" />
        <span class="h-2 rounded-full bg-accent/38" />
        <span class="h-2 rounded-full bg-foreground/10" />
      </div>
    </div>
  </div>
</template>
