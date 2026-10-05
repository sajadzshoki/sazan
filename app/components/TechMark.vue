<script setup lang="ts">
import type { TechKey } from '~/data/tech';
import { techLogos } from '~/data/tech';

defineProps<{
  tech: TechKey;
}>();
</script>

<template>
  <span class="tech-mark">
    <img v-if="!techLogos[tech].mono" :src="techLogos[tech].src" alt="" width="22" height="22">
    <span v-else class="tech-mark-mono" :style="{ '--mark': `url(${techLogos[tech].src})` }" aria-hidden="true" />
    <span>{{ techLogos[tech].name }}</span>
  </span>
</template>

<style scoped>
.tech-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.35rem;
  padding: 0.3rem 0.7rem 0.3rem 0.4rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 999px;
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.tech-mark img,
.tech-mark-mono {
  width: 1.15rem;
  height: 1.15rem;
  flex: none;
}

.tech-mark-mono {
  display: block;
  background: currentColor;
  -webkit-mask: var(--mark) center / contain no-repeat;
  mask: var(--mark) center / contain no-repeat;
}
</style>
