<script setup lang="ts">
const localePath = useLocalePath();

const points = [
  {
    key: 'who',
    icon: 'M12 12a3.2 3.2 0 1 0-3.2-3.2A3.2 3.2 0 0 0 12 12zm-6.2 7.2a6.2 6.2 0 0 1 12.4 0'
  },
  {
    key: 'does',
    icon: 'M8 6h8M8 10h8M8 14h5M6 3.5h12v17H6z'
  },
  {
    key: 'stuck',
    icon: 'M12 21s6-5.1 6-9.2A6 6 0 0 0 6 11.8C6 15.9 12 21 12 21zM12 11.2h.01'
  }
] as const;
</script>

<template>
  <section class="sazan-section">
    <BaseContainer>
      <div class="cta-panel">
        <div>
          <p class="sazan-eyebrow">
            {{ $t('studio.cta.eyebrow') }}
          </p>
          <h2 class="mt-4 max-w-xl text-3xl font-extrabold tracking-[-0.03em] text-balance text-foreground sm:text-4xl">
            {{ $t('studio.cta.title') }}
          </h2>
          <p class="mt-4 max-w-xl text-base leading-7 text-pretty text-muted">
            {{ $t('studio.cta.lead') }}
          </p>

          <ul class="mt-6 grid gap-2.5">
            <li v-for="point in points" :key="point.key" class="cta-point">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="point.icon" />
                </svg>
              </span>
              {{ $t(`studio.cta.points.${point.key}`) }}
            </li>
          </ul>

          <NuxtLink :to="localePath('/start-a-project')" class="sazan-button-primary mt-7 w-full sm:w-max">
            {{ $t('common.startProject') }}
            <span class="arrow-icon" aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div class="cta-scene" aria-hidden="true">
          <svg viewBox="0 0 420 320" fill="none">
            <rect x="28" y="36" width="250" height="168" rx="18" fill="rgb(var(--color-surface))" stroke="rgb(var(--color-border))" />
            <circle cx="52" cy="58" r="4" fill="rgb(var(--color-primary))" />
            <circle cx="68" cy="58" r="4" fill="rgb(var(--color-border-strong))" />
            <circle cx="84" cy="58" r="4" fill="rgb(var(--color-border-strong))" />
            <rect x="48" y="82" width="132" height="10" rx="5" fill="rgb(var(--color-foreground))" opacity="0.85" />
            <rect x="48" y="104" width="190" height="8" rx="4" fill="rgb(var(--color-muted))" opacity="0.45" />
            <rect x="48" y="122" width="168" height="8" rx="4" fill="rgb(var(--color-muted))" opacity="0.3" />
            <rect x="48" y="154" width="92" height="26" rx="13" fill="rgb(var(--color-primary))" />
            <rect x="214" y="78" width="118" height="176" rx="22" fill="rgb(var(--color-surface))" stroke="rgb(var(--color-border))" />
            <rect x="226" y="96" width="94" height="128" rx="8" fill="rgb(var(--color-background))" />
            <rect x="238" y="112" width="70" height="8" rx="4" fill="rgb(var(--color-primary))" opacity="0.8" />
            <rect x="238" y="130" width="54" height="6" rx="3" fill="rgb(var(--color-muted))" opacity="0.4" />
            <rect x="238" y="146" width="62" height="6" rx="3" fill="rgb(var(--color-muted))" opacity="0.28" />
            <circle cx="255" cy="248" r="4" fill="rgb(var(--color-foreground))" opacity="0.35" />
            <path d="M86 214c18 28 62 46 112 28" stroke="rgb(var(--color-primary))" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.cta-panel {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding: 1.4rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.5rem;
  background:
    radial-gradient(480px 240px at 100% 100%, rgb(var(--color-primary) / 0.12), transparent 60%),
    rgb(var(--color-soft));
}

.cta-point {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: rgb(var(--color-foreground));
  font-size: 0.95rem;
  font-weight: 700;
}

.cta-point span {
  display: grid;
  width: 2.15rem;
  height: 2.15rem;
  flex: none;
  place-items: center;
  border-radius: 0.7rem;
  background: rgb(var(--color-primary) / 0.12);
  color: rgb(var(--color-primary));
}

.cta-point svg {
  width: 1.05rem;
  height: 1.05rem;
}

.cta-scene {
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.25rem;
  background: rgb(var(--color-background));
}

.cta-scene svg {
  display: block;
  width: 100%;
  height: auto;
}

@media (min-width: 900px) {
  .cta-panel {
    grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.8fr);
    padding: 1.75rem;
  }
}

html[dir='rtl'] .cta-panel {
  background:
    radial-gradient(480px 240px at 0% 100%, rgb(var(--color-primary) / 0.12), transparent 60%),
    rgb(var(--color-soft));
}
</style>
