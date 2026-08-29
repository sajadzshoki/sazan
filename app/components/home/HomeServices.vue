<script setup lang="ts">
import { services } from '~/data/home';

const { t } = useI18n();
const { formatDigits } = useLocaleDigits();
</script>

<template>
  <section id="services" class="sazan-section-tight border-y border-border bg-surface/42">
    <BaseContainer>
      <div class="grid gap-12 lg:grid-cols-[0.38fr_0.62fr]">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            :eyebrow="t('home.services.eyebrow')"
            :title="t('home.services.title')"
            :lead="t('home.services.lead')"
          />
        </div>

        <div class="grid border-t border-border">
          <article
            v-for="service in services"
            :key="service.key"
            class="group grid gap-5 border-b border-border py-7 transition hover:bg-background/42 sm:grid-cols-[5rem_1fr] sm:gap-8 lg:grid-cols-[6rem_1fr_15rem]"
          >
            <div class="service-index text-2xl">
              {{ formatDigits(service.index) }}
            </div>

            <div>
              <h3 class="sazan-title-tight text-2xl font-black text-foreground sm:text-3xl">
                {{ t(`home.services.items.${service.key}.title`) }}
              </h3>
              <p class="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
                {{ t(`home.services.items.${service.key}.description`) }}
              </p>
            </div>

            <ul class="flex flex-wrap gap-2 lg:justify-end">
              <li
                v-for="technology in service.technologies"
                :key="technology"
                class="h-max rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted group-hover:border-primary/45 group-hover:text-foreground"
              >
                {{ technology }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
