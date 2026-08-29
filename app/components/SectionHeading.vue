<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
}>();
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'">
    <p class="sazan-eyebrow">
      {{ eyebrow }}
    </p>
    <h2 class="sazan-heading-lg mt-5 text-balance text-foreground">
      {{ title }}
    </h2>
    <p v-if="lead" class="sazan-body-lg mt-5 max-w-2xl text-pretty" :class="align === 'center' ? 'mx-auto' : ''">
      {{ lead }}
    </p>
  </div>
</template>
