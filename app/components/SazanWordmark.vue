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
  <span class="inline-flex items-center gap-2.5">
    <img
      src="/logo-nav.png"
      alt=""
      width="128"
      height="128"
      class="h-9 w-9 shrink-0 object-contain"
    >
    <span v-if="!compact" class="grid leading-none">
      <span
        class="wordmark-name text-[1.05rem] font-extrabold tracking-[-0.06em]"
        :class="inverted ? 'text-background' : 'text-foreground'"
      >
        SAZAN
      </span>
      <span
        class="wordmark-caption mt-1 text-[0.68rem] font-semibold"
        :class="inverted ? 'text-background/60' : 'text-muted'"
      >
        {{ $t('brand.shortTagline') }}
      </span>
    </span>
  </span>
</template>
