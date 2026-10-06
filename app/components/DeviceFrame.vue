<script setup lang="ts">
import type { DeviceType } from '~/utils/presentation';

withDefaults(defineProps<{
  type?: DeviceType;
  src?: string | undefined;
  alt?: string | undefined;
  title?: string | undefined;
  caption?: string | undefined;
  liveUrl?: string | undefined;
  live?: boolean;
  priority?: boolean;
}>(), {
  type: 'laptop',
  live: false,
  priority: false
});
</script>

<template>
  <DeviceLaptop v-if="type === 'laptop'">
    <DeviceScreen
      :src="src"
      :alt="alt"
      :title="title"
      :caption="caption"
      :live-url="liveUrl"
      :live="live"
      :priority="priority"
      asset-name="desktop screenshot"
    />
  </DeviceLaptop>
  <DeviceTablet v-else-if="type === 'tablet'">
    <DeviceScreen
      :src="src"
      :alt="alt"
      :title="title"
      :caption="caption"
      :live-url="liveUrl"
      :live="live"
      :priority="priority"
      asset-name="tablet screenshot"
    />
  </DeviceTablet>
  <DevicePhone v-else>
    <DeviceScreen
      :src="src"
      :alt="alt"
      :title="title"
      :caption="caption"
      :live-url="liveUrl"
      :live="live"
      :priority="priority"
      asset-name="mobile screenshot"
    />
  </DevicePhone>
</template>
