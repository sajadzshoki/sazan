<script setup lang="ts">
import type { LocalizedPortfolioGalleryItem } from '~/composables/usePortfolio';

const props = defineProps<{
  items: LocalizedPortfolioGalleryItem[];
}>();

const { t } = useI18n();

const getItemClass = (orientation: LocalizedPortfolioGalleryItem['orientation']) => {
  return `gallery-item-${orientation}`;
};
</script>

<template>
  <section v-if="props.items.length" class="sazan-section-tight">
    <BaseContainer>
      <div class="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-end">
        <SectionHeading
          :eyebrow="t('portfolio.detail.gallery.eyebrow')"
          :title="t('portfolio.detail.gallery.title')"
          :lead="t('portfolio.detail.gallery.lead')"
        />
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-12">
        <article
          v-for="item in props.items"
          :key="item.id"
          class="group scroll-reveal"
          :class="getItemClass(item.orientation)"
        >
          <PortfolioVisual
            :visual="item.visual"
            :label="t('portfolio.detail.gallery.visualLabel')"
            :title="item.title"
            :class="item.orientation === 'portrait' ? 'min-h-[36rem]' : 'min-h-[25rem]'"
          />
          <div class="mt-4 grid gap-2 border-t border-border pt-4 md:grid-cols-[0.35fr_0.65fr]">
            <h3 class="sazan-title-tight text-xl font-black text-foreground">
              {{ item.title }}
            </h3>
            <p class="text-sm leading-7 text-muted">
              {{ item.caption }}
            </p>
          </div>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>
