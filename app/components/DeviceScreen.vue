<script setup lang="ts">
import type { DeviceType } from '~/utils/presentation';

const props = withDefaults(defineProps<{
  src?: string | undefined;
  alt?: string | undefined;
  title?: string | undefined;
  caption?: string | undefined;
  liveUrl?: string | undefined;
  live?: boolean;
  assetName?: string;
}>(), {
  live: false,
  assetName: 'screenshot'
});

const showLive = computed(() => Boolean(props.live && props.liveUrl));
const showImage = computed(() => Boolean(props.src) && !showLive.value);
const isDev = import.meta.dev;
</script>

<template>
  <div class="screen">
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || title || ''"
      class="screen-media"
      loading="lazy"
      decoding="async"
    >
    <iframe
      v-else-if="showLive"
      class="screen-media"
      :src="liveUrl"
      :title="alt || title || 'Live preview'"
      loading="lazy"
      referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
    <div v-else class="screen-fallback" role="img" :aria-label="alt || title || caption">
      <div class="screen-fallback-bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div class="screen-fallback-body">
        <p v-if="isDev" class="screen-missing">
          Missing asset: {{ assetName }}
        </p>
        <p class="screen-kicker">{{ caption }}</p>
        <p class="screen-title">{{ title }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen,
.screen-media,
.screen-fallback {
  width: 100%;
  height: 100%;
}

.screen {
  position: relative;
  overflow: hidden;
  background: rgb(var(--color-surface));
}

.screen-media {
  display: block;
  border: 0;
  object-fit: cover;
  object-position: top center;
}

.screen-fallback {
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(rgb(var(--color-border) / 0.55) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--color-border) / 0.55) 1px, transparent 1px),
    rgb(var(--color-surface));
  background-size: 22px 22px, 22px 22px, auto;
}

.screen-fallback-bar {
  display: flex;
  gap: 0.35rem;
  padding: 0.7rem 0.8rem;
  background: rgb(var(--color-background-soft));
  border-bottom: 1px solid rgb(var(--color-border));
}

.screen-fallback-bar span {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: rgb(var(--color-border-strong));
}

.screen-fallback-bar span:first-child {
  background: rgb(var(--color-primary));
}

.screen-fallback-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.35rem;
  padding: 1rem;
}

.screen-missing {
  align-self: flex-start;
  margin-bottom: auto;
  border: 1px dashed rgb(var(--color-primary));
  background: rgb(var(--color-primary) / 0.08);
  color: rgb(var(--color-primary));
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.35rem 0.5rem;
}

.screen-kicker {
  color: rgb(var(--color-primary));
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.screen-title {
  color: rgb(var(--color-foreground));
  font-size: clamp(0.95rem, 1.4vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
</style>
