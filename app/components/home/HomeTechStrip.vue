<script setup lang="ts">
import { studioTechnologies } from '~/data/home';
</script>

<template>
  <section class="border-y border-border" :aria-label="$t('studio.tech.label')">
    <BaseContainer>
      <div class="flex gap-3 overflow-x-auto py-4 sm:justify-between">
        <p class="hidden shrink-0 self-center text-xs font-semibold text-subtle sm:block">
          {{ $t('studio.tech.label') }}
        </p>
        <ul class="flex min-w-max items-center gap-x-5 gap-y-2 sm:gap-x-7">
          <li v-for="(item, index) in studioTechnologies" :key="item" class="flex items-center gap-5 sm:gap-7">
            <span class="text-sm font-semibold text-foreground/80">{{ item }}</span>
            <span v-if="index < studioTechnologies.length - 1" class="h-1 w-1 rounded-full bg-primary/70" aria-hidden="true" />
          </li>
        </ul>
      </div>
    </BaseContainer>
  </section>
</template>
