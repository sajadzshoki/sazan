<script setup lang="ts">
import { services } from '~/data/home';

const localePath = useLocalePath();

const icons: Record<string, string> = {
  websites: 'M4 6h16v12H4z M4 10h16',
  webApps: 'M5 5h6v6H5z M13 5h6v6h-6z M5 13h6v6H5z M13 13h6v6h-6z',
  mobileApps: 'M8 3h8v18H8z M11 18h2',
  ecommerce: 'M5 7h14l-1.2 11H6.2z M9 7V5a3 3 0 0 1 6 0v2',
  adminPanels: 'M4 5h16v4H4z M4 11h7v8H4z M13 11h7v8h-7z',
  backendSystems: 'M5 7h14v4H5z M5 13h14v4H5z M8 9h.01 M8 15h.01'
};
</script>

<template>
  <section id="services" class="services-band">
    <BaseContainer>
      <div class="services-intro">
        <p class="sazan-eyebrow">
          {{ $t('studio.services.eyebrow') }}
        </p>
        <h2 class="services-title">
          {{ $t('studio.services.title') }}
        </h2>
        <div class="services-intro-foot">
          <p class="services-lead">
            {{ $t('studio.services.lead') }}
          </p>
          <NuxtLink :to="localePath('/services')" class="sazan-text-link services-all">
            {{ $t('studio.services.all') }}
            <span class="arrow-icon" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>

      <div class="services-grid">
        <NuxtLink
          v-for="service in services"
          :key="service.key"
          :to="localePath(`/services#${service.key}`)"
          class="group service-card sazan-focus"
        >
          <span class="service-index">{{ service.index }}</span>
          <span class="service-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path :d="icons[service.key]" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <h3>{{ $t(`home.services.items.${service.key}.title`) }}</h3>
          <p>{{ $t(`home.services.items.${service.key}.description`) }}</p>
          <span class="service-more arrow-icon" aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.services-band {
  padding-block: clamp(2.4rem, 4.2vw, 3.6rem);
}

.services-intro {
  max-width: 38rem;
}

.services-title {
  margin-top: 0.6rem;
  color: rgb(var(--color-foreground));
  font-size: clamp(1.65rem, 2.7vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.14;
  text-wrap: balance;
}

.services-intro-foot {
  display: grid;
  justify-items: start;
  gap: 0.55rem;
  margin-top: 0.65rem;
}

.services-lead {
  max-width: 28rem;
  color: rgb(var(--color-muted));
  font-size: 0.92rem;
  line-height: 1.6;
}

.services-all {
  font-size: 0.84rem;
}

.services-grid {
  display: grid;
  gap: 0.7rem;
  margin-top: 1.35rem;
}

.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.95rem 1rem 0.85rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.05rem;
  background:
    linear-gradient(165deg, rgb(var(--color-primary) / 0.07), transparent 46%),
    rgb(var(--color-surface));
  transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.service-card:hover {
  border-color: rgb(var(--color-primary) / 0.45);
  box-shadow: 0 10px 24px rgb(var(--color-primary) / 0.08);
  transform: translateY(-2px);
}

.service-icon {
  display: grid;
  width: 2.15rem;
  height: 2.15rem;
  place-items: center;
  border-radius: 0.7rem;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}

.service-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}

.service-index {
  position: absolute;
  top: 0.85rem;
  inset-inline-end: 0.9rem;
  color: rgb(var(--color-primary));
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.service-card h3 {
  margin-top: 0.35rem;
  color: rgb(var(--color-foreground));
  font-size: 1.02rem;
  font-weight: 800;
}

.service-card p {
  color: rgb(var(--color-muted));
  font-size: 0.82rem;
  line-height: 1.5;
}

.service-more {
  margin-top: 0.2rem;
  color: rgb(var(--color-primary));
  font-size: 0.9rem;
  font-weight: 700;
}

html[dir='rtl'] .services-title {
  letter-spacing: 0;
  line-height: 1.4;
}

html[dir='rtl'] .service-index {
  letter-spacing: 0;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
