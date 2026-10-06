<script setup lang="ts">
const parts = ['shop', 'mobile', 'panel', 'api'] as const;

const icons: Record<(typeof parts)[number], string> = {
  shop: 'M5 8h14l-1.2 11H6.2zM9 8V6.5a3 3 0 0 1 6 0V8',
  mobile: 'M9 3.5h6a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1zM11 17.5h2',
  panel: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  api: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12'
};
</script>

<template>
  <section class="intro-band">
    <BaseContainer>
      <div class="intro-panel">
        <div class="max-w-xl">
          <p class="sazan-eyebrow">
            {{ $t('studio.intro.eyebrow') }}
          </p>
          <h2 class="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-balance text-foreground sm:text-4xl">
            {{ $t('studio.intro.title') }}
          </h2>
          <p class="mt-4 max-w-lg text-base leading-7 text-pretty text-muted">
            {{ $t('studio.intro.lead') }}
          </p>
        </div>

        <ol class="intro-path">
          <li v-for="(part, index) in parts" :key="part" class="intro-step">
            <span class="intro-node" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path :d="icons[part]" />
              </svg>
            </span>
            <span class="intro-label">
              <span class="intro-index">0{{ index + 1 }}</span>
              {{ $t(`studio.intro.parts.${part}`) }}
            </span>
          </li>
        </ol>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.intro-band {
  padding-block: clamp(2.4rem, 4.2vw, 3.6rem);
}

.intro-panel {
  display: grid;
  gap: 2rem;
  padding: 1.5rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.5rem;
  background:
    radial-gradient(520px 220px at 100% 0%, rgb(var(--color-primary) / 0.1), transparent 62%),
    rgb(var(--color-surface));
}

.intro-path {
  display: grid;
  gap: 0.85rem;
}

.intro-step {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.intro-node {
  position: relative;
  z-index: 1;
  display: grid;
  width: 2.7rem;
  height: 2.7rem;
  flex: none;
  place-items: center;
  border: 1px solid rgb(var(--color-primary) / 0.35);
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 40%, rgb(var(--color-primary) / 0.16), transparent 62%),
    rgb(var(--color-surface));
  color: rgb(var(--color-primary));
  box-shadow: 0 0 0 6px rgb(var(--color-surface));
}

.intro-node svg {
  width: 1.15rem;
  height: 1.15rem;
}

.intro-label {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  color: rgb(var(--color-foreground));
  font-size: 1.05rem;
  font-weight: 800;
}

.intro-index {
  color: rgb(var(--color-primary));
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

@media (min-width: 900px) {
  .intro-panel {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: center;
    gap: 2.5rem;
    padding: 2rem 2.25rem;
  }

  .intro-path {
    position: relative;
    gap: 1.15rem;
    padding-inline-start: 0.15rem;
  }

  .intro-path::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset-inline-start: calc(0.15rem + 1.35rem - 1px);
    top: 1.35rem;
    bottom: 1.35rem;
    width: 2px;
    background: linear-gradient(rgb(var(--color-primary)), rgb(var(--color-border)));
  }
}

html[dir='rtl'] .intro-panel {
  background:
    radial-gradient(520px 220px at 0% 0%, rgb(var(--color-primary) / 0.1), transparent 62%),
    rgb(var(--color-surface));
}

html[dir='rtl'] .intro-index {
  letter-spacing: 0;
}
</style>
