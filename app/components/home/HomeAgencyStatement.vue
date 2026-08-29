<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section class="sazan-section-tight overflow-hidden bg-foreground text-background">
    <BaseContainer>
      <div class="grid gap-10 lg:grid-cols-[0.25fr_0.75fr] lg:items-start">
        <div class="sazan-meta text-background/52">
          {{ t('home.statement.eyebrow') }}
        </div>

        <div>
          <p class="sazan-editorial-statement max-w-5xl text-balance text-[clamp(2.6rem,6.6vw,7.2rem)] font-black">
            {{ t('home.statement.title') }}
          </p>
          <div class="mt-9 grid gap-6 border-t border-background/16 pt-7 md:mt-10 md:grid-cols-2 md:pt-8">
            <p class="text-lg leading-8 text-background/76">
              {{ t('home.statement.lead') }}
            </p>
            <p class="text-lg leading-8 text-background/58">
              {{ t('home.statement.support') }}
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
