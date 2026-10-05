<script setup lang="ts">
import { processSteps } from '~/data/home';

const { formatDigits } = useLocaleDigits();

const icons: Record<string, string> = {
  discover: 'M12 21a9 9 0 1 0-9-9M12 12l4-2M12 7v5',
  design: 'M4 20l4.2-1.1L19 8.1a1.8 1.8 0 0 0-2.5-2.5L5.7 16.4 4 20z',
  build: 'M8 8l-4 4 4 4M16 8l4 4-4 4',
  launch: 'M12 19V5M6 11l6-6 6 6',
  evolve: 'M20 12a8 8 0 0 1-13.7 5.6L4 16M4 12a8 8 0 0 1 13.7-5.6L20 8M4 16v-4M20 8v4'
};
</script>

<template>
  <section id="process" class="border-t border-border py-12 sm:py-16">
    <BaseContainer>
      <div class="max-w-2xl">
        <p class="sazan-eyebrow">
          {{ $t('studio.process.eyebrow') }}
        </p>
        <h2 class="sazan-heading-lg mt-4 max-w-xl text-balance text-foreground">
          {{ $t('studio.process.title') }}
        </h2>
        <p class="mt-3 max-w-xl text-base leading-7 text-muted">
          {{ $t('studio.process.lead') }}
        </p>
      </div>

      <ol class="roadmap">
        <li v-for="(step, index) in processSteps" :key="step.key" class="roadmap-step">
          <span class="roadmap-node" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path :d="icons[step.key]" />
            </svg>
          </span>
          <div class="roadmap-copy">
            <p class="roadmap-index">
              {{ formatDigits(step.index) }}
              <span v-if="index < processSteps.length - 1" class="roadmap-next" aria-hidden="true">→</span>
            </p>
            <h3>{{ $t(`home.process.steps.${step.key}.title`) }}</h3>
            <p>{{ $t(`home.process.steps.${step.key}.description`) }}</p>
          </div>
        </li>
      </ol>
    </BaseContainer>
  </section>
</template>

<style scoped>
.roadmap {
  position: relative;
  display: grid;
  gap: 1.35rem;
  margin-top: 2.25rem;
}

.roadmap::before {
  content: '';
  position: absolute;
  inset-inline-start: 1.28rem;
  top: 0.4rem;
  bottom: 0.4rem;
  width: 2px;
  background: linear-gradient(rgb(var(--color-primary)), rgb(var(--color-border)));
}

.roadmap-step {
  position: relative;
  display: grid;
  grid-template-columns: 2.65rem minmax(0, 1fr);
  gap: 0.9rem;
  align-items: start;
}

.roadmap-node {
  position: relative;
  z-index: 1;
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  place-items: center;
  border: 1px solid rgb(var(--color-primary) / 0.45);
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 40%, rgb(var(--color-primary) / 0.16), transparent 62%),
    rgb(var(--color-surface));
  color: rgb(var(--color-primary));
  box-shadow: 0 0 0 6px rgb(var(--color-background)), 0 10px 24px rgb(var(--color-primary) / 0.12);
}

.roadmap-node svg {
  width: 1.05rem;
  height: 1.05rem;
}

.roadmap-index {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: rgb(var(--color-primary));
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.roadmap-next {
  display: none;
  color: rgb(var(--color-primary) / 0.7);
}

.roadmap-copy h3 {
  margin-top: 0.25rem;
  color: rgb(var(--color-foreground));
  font-size: 1.15rem;
  font-weight: 800;
}

.roadmap-copy p:last-child {
  margin-top: 0.4rem;
  color: rgb(var(--color-muted));
  font-size: 0.92rem;
  line-height: 1.65;
}

@media (min-width: 1024px) {
  .roadmap {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1.25rem;
    margin-top: 2.75rem;
  }

  .roadmap::before {
    inset-inline: 8% 6%;
    top: 1.2rem;
    bottom: auto;
    width: auto;
    height: 2px;
    background: linear-gradient(90deg, rgb(var(--color-primary)), rgb(var(--color-primary) / 0.15) 88%);
  }

  .roadmap-step {
    display: block;
    padding-top: 0.1rem;
  }

  .roadmap-node {
    width: 2.5rem;
    height: 2.5rem;
  }

  .roadmap-next {
    display: inline;
  }

  .roadmap-copy {
    margin-top: 0.9rem;
  }

  html[dir='rtl'] .roadmap::before {
    background: linear-gradient(270deg, rgb(var(--color-primary)), rgb(var(--color-border)) 80%);
  }
}

html[dir='rtl'] .roadmap-next {
  transform: scaleX(-1);
}
</style>
