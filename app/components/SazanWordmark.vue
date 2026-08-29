<script setup lang="ts">
withDefaults(defineProps<{
  compact?: boolean;
  inverted?: boolean;
}>(), {
  compact: false,
  inverted: false
});
</script>

<template>
  <span class="inline-flex items-center gap-3">
    <span
      class="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden border"
      :class="inverted ? 'border-background bg-background text-foreground' : 'border-foreground bg-foreground text-background'"
    >
      <span class="absolute inset-x-1/2 top-0 h-full w-px -translate-x-1/2 bg-current/25" aria-hidden="true" />
      <span class="absolute inset-y-1/2 left-0 h-px w-full -translate-y-1/2 bg-current/25" aria-hidden="true" />
      <span class="relative text-sm font-black tracking-[-0.08em]">S</span>
    </span>

    <span v-if="!compact" class="grid leading-none">
      <span class="wordmark-name text-lg font-black tracking-[-0.08em] uppercase">{{ $t('brand.name') }}</span>
      <span
        class="wordmark-caption mt-1 text-[0.65rem] font-bold tracking-[0.2em] uppercase"
        :class="inverted ? 'text-background/55' : 'text-muted'"
      >
        {{ $t('brand.shortTagline') }}
      </span>
    </span>
  </span>
</template>
