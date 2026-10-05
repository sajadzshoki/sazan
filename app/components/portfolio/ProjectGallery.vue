<script setup lang="ts">
import type { LocalizedPortfolioGalleryItem } from '~/composables/usePortfolio';

defineProps<{
  items: LocalizedPortfolioGalleryItem[];
}>();

const { t } = useI18n();

const deviceFor = (orientation: LocalizedPortfolioGalleryItem['orientation']) => {
  return orientation === 'portrait' ? 'phone' as const : 'laptop' as const;
};
</script>

<template>
  <section v-if="items.length" class="sazan-section-tight border-t border-border">
    <BaseContainer>
      <div class="max-w-2xl">
        <p class="sazan-eyebrow">
          {{ t('portfolio.detail.gallery.eyebrow') }}
        </p>
        <h2 class="sazan-heading-lg mt-5 text-balance text-foreground">
          {{ t('portfolio.detail.gallery.title') }}
        </h2>
        <p class="sazan-body-lg mt-5 text-pretty">
          {{ t('portfolio.detail.gallery.lead') }}
        </p>
      </div>

      <div class="mt-10 grid gap-10 md:grid-cols-2">
        <article v-for="item in items" :key="item.id">
          <DeviceFrame
            :type="deviceFor(item.orientation)"
            :title="item.title"
            :caption="item.caption"
            :alt="item.title"
          />
          <h3 class="mt-4 text-lg font-extrabold text-foreground">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-sm leading-7 text-muted">
            {{ item.caption }}
          </p>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>
