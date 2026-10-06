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

const WALK_MS = 1700;
const HOLD_MS = 1300;
const lastIndex = processSteps.length - 1;

const roadmap = ref<HTMLElement | null>(null);
const station = ref(0);
const walking = ref(false);
const quiet = ref(false);
const motion = ref(true);
const visible = ref(false);

let timer: ReturnType<typeof setTimeout> | undefined;
let motionQuery: MediaQueryList | undefined;
let observer: IntersectionObserver | undefined;

const moving = computed(() => motion.value && walking.value);
const canRun = () => motion.value && visible.value && !document.hidden;

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
};

const arm = (wait: number) => {
  clearTimer();

  if (!canRun()) {
    return;
  }

  timer = setTimeout(tick, wait);
};

const tick = () => {
  if (!canRun()) {
    return;
  }

  if (station.value >= lastIndex) {
    quiet.value = true;
    walking.value = false;
    station.value = 0;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!canRun()) {
          quiet.value = false;
          return;
        }

        quiet.value = false;
        walking.value = true;
        arm(WALK_MS);
      });
    });

    return;
  }

  station.value += 1;
  arm(station.value >= lastIndex ? HOLD_MS : WALK_MS);
};

const start = () => {
  clearTimer();

  if (!motion.value) {
    station.value = 0;
    walking.value = false;
    return;
  }

  if (!canRun()) {
    return;
  }

  if (!walking.value) {
    requestAnimationFrame(() => {
      if (!canRun()) {
        return;
      }

      walking.value = true;
      arm(WALK_MS);
    });

    return;
  }

  arm(station.value >= lastIndex ? HOLD_MS : WALK_MS);
};

const onMotionChange = () => {
  motion.value = !motionQuery?.matches;
  start();
};

const onVisibility = () => {
  if (document.hidden) {
    clearTimer();
    return;
  }

  start();
};

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motion.value = !motionQuery.matches;
  motionQuery.addEventListener('change', onMotionChange);
  document.addEventListener('visibilitychange', onVisibility);

  observer = new IntersectionObserver(([entry]) => {
    visible.value = Boolean(entry?.isIntersecting);

    if (visible.value) {
      start();
      return;
    }

    clearTimer();
  }, { threshold: 0.45 });

  if (roadmap.value) {
    observer.observe(roadmap.value);
  }
});

onBeforeUnmount(() => {
  clearTimer();
  motionQuery?.removeEventListener('change', onMotionChange);
  document.removeEventListener('visibilitychange', onVisibility);
  observer?.disconnect();
});
</script>

<template>
  <section id="process" class="process-band border-t border-border">
    <BaseContainer>
      <div class="max-w-xl">
        <p class="sazan-eyebrow">
          {{ $t('studio.process.eyebrow') }}
        </p>
        <h2 class="process-title">
          {{ $t('studio.process.title') }}
        </h2>
        <p class="mt-2 max-w-lg text-sm leading-6 text-muted">
          {{ $t('studio.process.lead') }}
        </p>
      </div>

      <ol
        ref="roadmap"
        class="roadmap"
        :class="{ 'is-quiet': quiet, 'is-moving': moving }"
      >
        <li
          v-for="(step, index) in processSteps"
          :key="step.key"
          class="roadmap-step"
          :class="{
            'is-current': moving && index === station,
            'is-done': moving && index < station
          }"
        >
          <span class="roadmap-node" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path :d="icons[step.key]" />
            </svg>
          </span>
          <span
            v-if="index < processSteps.length - 1"
            class="roadmap-leg"
            aria-hidden="true"
            :class="{
              'is-complete': moving && index < station,
              'is-live': moving && index === station
            }"
          >
            <span class="roadmap-leg-fill" />
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
.process-band {
  padding-block: clamp(2.4rem, 4.2vw, 3.6rem);
}

.process-title {
  margin-top: 0.55rem;
  max-width: 34rem;
  color: rgb(var(--color-foreground));
  font-size: clamp(1.65rem, 2.7vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.14;
  text-wrap: balance;
}

html[dir='rtl'] .process-title {
  letter-spacing: 0;
  line-height: 1.4;
}

.roadmap {
  position: relative;
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
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
  border: 1px solid rgb(var(--color-border-strong));
  border-radius: 999px;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-subtle));
  box-shadow: 0 0 0 6px rgb(var(--color-background));
  transition:
    background-color 280ms var(--ease-studio),
    border-color 280ms var(--ease-studio),
    color 280ms var(--ease-studio),
    box-shadow 280ms var(--ease-studio);
}

.roadmap-node svg {
  width: 1.05rem;
  height: 1.05rem;
}

.roadmap-leg {
  position: absolute;
  z-index: 0;
  overflow: visible;
  pointer-events: none;
  background: rgb(var(--color-border));
  inset-inline-start: calc(1.325rem - 1px);
  top: 2.65rem;
  width: 2px;
  height: calc(100% - 2.65rem + 1rem);
}

.roadmap-leg-fill {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  width: 100%;
  height: 0;
  background: rgb(var(--color-primary));
  transition: height 1.7s linear;
}

.roadmap-leg.is-live .roadmap-leg-fill,
.roadmap-leg.is-complete .roadmap-leg-fill {
  height: 100%;
}

.roadmap-leg-fill::after {
  content: '';
  position: absolute;
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 999px;
  background: rgb(var(--color-primary));
  box-shadow:
    0 0 0 4px rgb(var(--color-background)),
    0 0 0 6px rgb(var(--color-primary) / 0.38);
  opacity: 0;
  inset-inline-start: 50%;
  bottom: 0;
  translate: -50% 50%;
}

.roadmap-leg.is-live .roadmap-leg-fill::after {
  opacity: 1;
}

.roadmap.is-quiet .roadmap-leg-fill {
  transition: none;
}

.roadmap-index {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: rgb(var(--color-subtle));
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  transition: color 280ms var(--ease-studio);
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

.roadmap.is-moving .roadmap-step:not(.is-current):not(.is-done) .roadmap-copy {
  opacity: 0.72;
}

.roadmap.is-moving .roadmap-copy {
  transition: opacity 280ms var(--ease-studio);
}

.is-done .roadmap-node,
.is-current .roadmap-node {
  border-color: rgb(var(--color-primary));
  color: rgb(var(--color-primary));
}

.is-done .roadmap-index,
.is-current .roadmap-index {
  color: rgb(var(--color-primary));
}

.is-current .roadmap-node {
  background: rgb(var(--color-primary));
  color: rgb(var(--color-on-primary));
  box-shadow:
    0 0 0 6px rgb(var(--color-background)),
    0 0 0 9px rgb(var(--color-primary) / 0.2);
}

@media (prefers-reduced-motion: no-preference) {
  .is-current .roadmap-node {
    animation: road-pulse 1.7s ease-out infinite;
  }

  .is-current .roadmap-next {
    animation: road-nudge 1.7s ease-in-out infinite;
  }
}

@keyframes road-pulse {
  0% {
    box-shadow:
      0 0 0 6px rgb(var(--color-background)),
      0 0 0 7px rgb(var(--color-primary) / 0.34);
  }

  100% {
    box-shadow:
      0 0 0 6px rgb(var(--color-background)),
      0 0 0 14px rgb(var(--color-primary) / 0);
  }
}

@keyframes road-nudge {
  50% {
    transform: translateX(4px);
  }
}

@keyframes road-nudge-rtl {
  50% {
    transform: scaleX(-1) translateX(4px);
  }
}

@media (min-width: 1024px) {
  .roadmap {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.9rem;
    margin-top: 1.75rem;
  }

  .roadmap-step {
    display: block;
    padding-top: 0.1rem;
  }

  .roadmap-node {
    width: 2.5rem;
    height: 2.5rem;
  }

  .roadmap-leg {
    inset-inline-start: 2.5rem;
    top: calc(0.1rem + 1.25rem - 1px);
    width: calc(100% - 2.5rem + 0.9rem);
    height: 2px;
  }

  .roadmap-leg-fill {
    width: 0;
    height: 100%;
    transition: width 1.7s linear;
  }

  .roadmap-leg.is-live .roadmap-leg-fill,
  .roadmap-leg.is-complete .roadmap-leg-fill {
    width: 100%;
    height: 100%;
  }

  .roadmap-leg-fill::after {
    inset-inline-start: auto;
    bottom: auto;
    top: 50%;
    inset-inline-end: 0;
    translate: 50% -50%;
  }

  .roadmap-next {
    display: inline;
  }

  .roadmap-copy {
    margin-top: 0.9rem;
  }
}

html[dir='rtl'] .roadmap-next {
  transform: scaleX(-1);
}

html[dir='rtl'] .is-current .roadmap-next {
  animation-name: road-nudge-rtl;
}

html[dir='rtl'] .roadmap-leg-fill::after {
  translate: -50% 50%;
}

@media (min-width: 1024px) {
  html[dir='rtl'] .roadmap-leg-fill::after {
    translate: -50% -50%;
  }
}
</style>
