<script setup lang="ts">
import { screenshotFor } from '~/utils/presentation';

const localePath = useLocalePath();
const { t } = useI18n();
const { isRtl } = useAppDirection();
const { formatDigits } = useLocaleDigits();
const { featuredProjects, projects } = usePortfolio();

const markKeys = ['web', 'apps', 'commerce', 'systems'] as const;
const traceKeys = ['design', 'build', 'product'] as const;

const stage = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const wordIndex = ref(0);
const slide = ref(1);
const stageHovered = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const canEmbed = ref(false);
const finePointer = ref(false);
const reducedMotion = ref(false);

const showcase = computed(() => featuredProjects.value.length ? featuredProjects.value : projects.value);
const count = computed(() => showcase.value.length);
const current = computed(() => showcase.value[activeIndex.value]);
const previousProject = computed(() => count.value ? showcase.value[(activeIndex.value - 1 + count.value) % count.value] : undefined);
const nextProject = computed(() => count.value ? showcase.value[(activeIndex.value + 1) % count.value] : undefined);
const casePath = computed(() => current.value ? localePath(`/projects/${current.value.slug}`) : localePath('/projects'));
const liveUrl = computed(() => current.value?.demoUrl || current.value?.projectUrl || '');
const laptopSrc = computed(() => screenshotFor(current.value?.media, 'laptop'));
const phoneSrc = computed(() => screenshotFor(current.value?.media, 'phone'));
const categoryLabel = computed(() => current.value ? t(`portfolio.categories.${current.value.category}`) : '');
const currentNumber = computed(() => formatDigits(String(activeIndex.value + 1).padStart(2, '0')));
const totalNumber = computed(() => formatDigits(String(Math.max(count.value, 1)).padStart(2, '0')));
const activeMark = computed(() => markKeys[wordIndex.value] || markKeys[0]);
const swapX = computed(() => {
  const direction = slide.value >= 0 ? 1 : -1;
  const rtl = isRtl.value ? -1 : 1;

  return `${direction * rtl * 1.05}rem`;
});

const { embeddable } = useFrameEmbed(liveUrl);
const liveActive = computed(() => canEmbed.value && embeddable.value && Boolean(liveUrl.value));

const parallaxStyle = (x: number, y: number) => {
  if (!finePointer.value || reducedMotion.value || (offsetX.value === 0 && offsetY.value === 0)) {
    return undefined;
  }

  return {
    transform: `translate3d(${offsetX.value * x}px, ${offsetY.value * y}px, 0)`
  };
};

const go = (delta: number) => {
  if (count.value < 2) {
    return;
  }

  slide.value = delta >= 0 ? 1 : -1;
  activeIndex.value = (activeIndex.value + delta + count.value) % count.value;
  startShowcase();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
    return;
  }

  const target = event.target as HTMLElement | null;

  if (target?.closest('input, textarea, select, iframe')) {
    return;
  }

  event.preventDefault();
  const forward = event.key === 'ArrowRight';
  go(isRtl.value ? (forward ? -1 : 1) : (forward ? 1 : -1));
};

const onPointerMove = (event: PointerEvent) => {
  if (startX) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (!lock && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
  }

  if (!stage.value || !finePointer.value || reducedMotion.value) {
    return;
  }

  const rect = stage.value.getBoundingClientRect();
  offsetX.value = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
  offsetY.value = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
};

const resetOffset = () => {
  offsetX.value = 0;
  offsetY.value = 0;
};

let startX = 0;
let startY = 0;
let lock: 'x' | 'y' | null = null;

const onPointerDown = (event: PointerEvent) => {
  if (finePointer.value || (event.target as HTMLElement).closest('button, a, iframe, input')) {
    return;
  }

  startX = event.clientX;
  startY = event.clientY;
  lock = null;
};

const onPointerUp = (event: PointerEvent) => {
  if (lock === 'x') {
    const dx = event.clientX - startX;

    if (Math.abs(dx) > 48) {
      const forward = isRtl.value ? dx > 0 : dx < 0;
      go(forward ? 1 : -1);
    }
  }

  startX = 0;
  lock = null;
};

let wordTimer: ReturnType<typeof setInterval> | undefined;
let showcaseTimer: ReturnType<typeof setInterval> | undefined;
let motionQuery: MediaQueryList | undefined;
let fineQuery: MediaQueryList | undefined;
let wideQuery: MediaQueryList | undefined;

const stopShowcase = () => {
  if (showcaseTimer) {
    clearInterval(showcaseTimer);
    showcaseTimer = undefined;
  }
};

const startShowcase = () => {
  stopShowcase();

  if (!import.meta.client || reducedMotion.value) {
    return;
  }

  showcaseTimer = setInterval(() => {
    if (stageHovered.value || reducedMotion.value || document.hidden || count.value < 2) {
      return;
    }

    go(1);
  }, 3000);
};

const syncQueries = () => {
  reducedMotion.value = Boolean(motionQuery?.matches);
  finePointer.value = Boolean(fineQuery?.matches);
  canEmbed.value = Boolean(wideQuery?.matches);

  if (reducedMotion.value && wordTimer) {
    clearInterval(wordTimer);
    wordTimer = undefined;
  }

  if (!reducedMotion.value && !wordTimer && import.meta.client) {
    wordTimer = setInterval(() => {
      wordIndex.value = (wordIndex.value + 1) % markKeys.length;
    }, 2600);
  }

  startShowcase();
};

const onStageEnter = () => {
  stageHovered.value = true;
};

const onStageLeave = (event: PointerEvent) => {
  const next = event.relatedTarget as Node | null;

  if (!next || stage.value?.contains(next)) {
    return;
  }

  stageHovered.value = false;
  resetOffset();
};

const onWindowPointer = (event: PointerEvent) => {
  if (!stageHovered.value || !stage.value) {
    return;
  }

  const rect = stage.value.getBoundingClientRect();
  const inside = event.clientX >= rect.left
    && event.clientX <= rect.right
    && event.clientY >= rect.top
    && event.clientY <= rect.bottom;

  if (!inside) {
    stageHovered.value = false;
    resetOffset();
  }
};

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  wideQuery = window.matchMedia('(min-width: 1080px)');
  syncQueries();
  motionQuery.addEventListener('change', syncQueries);
  fineQuery.addEventListener('change', syncQueries);
  wideQuery.addEventListener('change', syncQueries);
  window.addEventListener('pointermove', onWindowPointer);
});

onBeforeUnmount(() => {
  motionQuery?.removeEventListener('change', syncQueries);
  fineQuery?.removeEventListener('change', syncQueries);
  wideQuery?.removeEventListener('change', syncQueries);
  window.removeEventListener('pointermove', onWindowPointer);

  if (wordTimer) {
    clearInterval(wordTimer);
  }

  stopShowcase();
});

watch(count, (value) => {
  if (activeIndex.value >= value) {
    activeIndex.value = 0;
  }
});

watch(stageHovered, (hovered) => {
  if (!hovered) {
    startShowcase();
  }
});
</script>

<template>
  <section class="hero" aria-labelledby="home-hero-title">
    <BaseContainer>
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="sazan-eyebrow motion-fade-up">
            {{ $t('studio.hero.eyebrow') }}
          </p>

          <div class="hero-heading motion-fade-up motion-delay-1">
            <span class="hero-mark" aria-hidden="true">
              <span class="hero-mark-line">
                <span class="hero-mark-slot">
                  <Transition name="hero-word" mode="out-in">
                    <span :key="activeMark" class="hero-mark-word">{{ $t(`studio.hero.marks.${activeMark}`) }}</span>
                  </Transition>
                </span>
                <span class="hero-mark-brand">{{ $t('studio.hero.marks.brand') }}</span>
              </span>
            </span>
            <h1 id="home-hero-title" class="hero-title">
              {{ $t('studio.hero.title') }}
            </h1>
          </div>

          <p class="sazan-body-lg hero-lead motion-fade-up motion-delay-2">
            {{ $t('studio.hero.lead') }}
          </p>

          <div class="hero-actions motion-fade-up motion-delay-3">
            <NuxtLink :to="localePath('/start-a-project')" class="sazan-button-primary hero-primary">
              {{ $t('common.startProject') }}
              <span class="arrow-icon" aria-hidden="true">→</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/projects')" class="hero-secondary sazan-focus">
              {{ $t('studio.hero.secondaryCta') }}
              <span class="arrow-icon" aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <div
          v-if="current"
          ref="stage"
          class="hero-stage"
          :aria-roledescription="$t('studio.work.carousel')"
          :aria-label="$t('studio.hero.showcaseLabel')"
          @keydown="onKeydown"
          @pointerenter="onStageEnter"
          @pointerleave="onStageLeave"
          @pointermove="onPointerMove"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div class="hero-meta hero-enter-meta">
            <div class="hero-meta-copy">
              <p class="hero-count">
                <span>{{ currentNumber }}</span>
                <span class="hero-count-sep" aria-hidden="true">/</span>
                <span class="hero-count-total">{{ totalNumber }}</span>
              </p>
              <NuxtLink :to="casePath" class="hero-project-name sazan-focus">
                {{ current.title }}
              </NuxtLink>
              <p class="hero-project-kind">
                <span v-if="liveActive" class="live-pip" aria-hidden="true" />
                <span v-if="liveActive" class="sr-only">{{ $t('studio.work.liveOn') }}. </span>
                {{ categoryLabel }}
              </p>
            </div>

            <div class="hero-nav" role="group" :aria-label="$t('studio.work.carousel')">
              <button
                type="button"
                class="hero-nav-btn sazan-focus"
                :disabled="count < 2"
                :aria-label="previousProject ? $t('studio.work.previousNamed', { title: previousProject.title }) : $t('studio.work.previous')"
                @click="go(-1)"
              >
                <span class="arrow-icon" aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                class="hero-nav-btn sazan-focus"
                :disabled="count < 2"
                :aria-label="nextProject ? $t('studio.work.nextNamed', { title: nextProject.title }) : $t('studio.work.next')"
                @click="go(1)"
              >
                <span class="arrow-icon" aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div class="hero-canvas" :style="{ '--swap-x': swapX }">
            <div class="hero-trace hero-enter-trace" aria-hidden="true">
              <svg class="trace-svg" viewBox="0 0 88 168" fill="none">
                <path d="M7 8 V160" />
                <path d="M7 8 H24" />
                <path d="M7 84 H24" />
                <path d="M7 160 H78" />
                <circle cx="7" cy="8" r="2.6" />
                <circle cx="7" cy="84" r="2.6" />
                <circle cx="7" cy="160" r="2.6" />
              </svg>
              <ol class="trace-labels">
                <li v-for="key in traceKeys" :key="key">
                  {{ $t(`studio.hero.trace.${key}`) }}
                </li>
              </ol>
            </div>

            <div class="laptop-enter">
              <div class="parallax" :style="parallaxStyle(1, 1)">
                <div class="swap">
                  <Transition name="hero-swap">
                    <div :key="current.slug" class="swap-item">
                      <DeviceFrame
                        type="laptop"
                        :title="current.title"
                        :caption="categoryLabel"
                        :src="laptopSrc"
                        :alt="liveActive ? current.title : ''"
                        :live-url="liveUrl"
                        :live="liveActive"
                        :priority="activeIndex === 0"
                      />
                      <NuxtLink
                        v-if="!liveActive"
                        :to="casePath"
                        class="device-hit sazan-focus"
                        :aria-label="$t('portfolio.card.openProject', { title: current.title })"
                      />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <div class="phone-slot">
              <div class="phone-enter">
                <div class="parallax" :style="parallaxStyle(-0.45, -0.3)">
                  <div class="swap">
                    <Transition name="phone-swap">
                      <div :key="current.slug" class="swap-item">
                        <DeviceFrame
                          type="phone"
                          :title="current.title"
                          :caption="categoryLabel"
                          :src="phoneSrc"
                          alt=""
                          :priority="activeIndex === 0"
                        />
                        <NuxtLink
                          :to="casePath"
                          class="device-hit device-hit-phone sazan-focus"
                          :aria-label="$t('portfolio.card.openProject', { title: current.title })"
                        />
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="sr-only" aria-live="polite">
            {{ current.title }}. {{ $t('studio.work.count', { current: currentNumber, total: totalNumber }) }}
          </p>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.hero {
  overflow: clip;
  padding-top: clamp(1.05rem, 2vw, 2.2rem);
  padding-bottom: clamp(1.75rem, 3vw, 2.75rem);
}

.hero-grid {
  display: grid;
  align-items: center;
  gap: 2.25rem;
}

.hero-copy {
  min-width: 0;
  max-width: 38rem;
}

.hero-heading {
  position: relative;
  container-type: inline-size;
  margin-top: 0.85rem;
  padding-top: 2.8rem;
}

.hero-mark {
  position: absolute;
  z-index: 0;
  inset-inline-start: 0;
  top: 0;
  max-width: 100%;
  overflow: hidden;
  color: rgb(var(--color-primary) / 0.22);
  font-size: clamp(1.35rem, 7.4cqi, 1.85rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.hero-mark-line {
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
  gap: 0.32em;
}

.hero-mark-slot {
  position: relative;
  display: inline-grid;
}

.hero-mark-word {
  display: block;
}

.hero-mark-brand {
  letter-spacing: 0.12em;
}

.hero-title {
  position: relative;
  z-index: 1;
  color: rgb(var(--color-foreground));
  font-size: clamp(2.15rem, 3.2vw, 3.15rem);
  font-weight: 800;
  letter-spacing: -0.048em;
  line-height: 0.98;
  white-space: pre-line;
}

.hero-lead {
  max-width: 34rem;
  margin-top: 1.15rem;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1.15rem;
  margin-top: 1.7rem;
}

.hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem;
  padding-inline: 0.15rem;
  border-radius: 999px;
  color: rgb(var(--color-muted));
  font-size: 0.92rem;
  font-weight: 600;
}

.hero-secondary:hover {
  color: rgb(var(--color-foreground));
}

.hero-stage {
  position: relative;
  min-width: 0;
  --hero-enter-x: 1.7rem;
}

.hero-meta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgb(var(--color-border));
}

.hero-meta-copy {
  min-width: 0;
}

.hero-count {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  color: rgb(var(--color-foreground));
  font-size: 0.78rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.14em;
}

.hero-count-sep,
.hero-count-total {
  color: rgb(var(--color-subtle));
}

.hero-project-name {
  display: block;
  margin-top: 0.2rem;
  min-height: 1.35em;
  color: rgb(var(--color-foreground));
  font-size: clamp(1.2rem, 1.7vw, 1.55rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.hero-project-name:hover {
  color: rgb(var(--color-primary));
}

.hero-project-kind {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 1.2em;
  margin-top: 0.15rem;
  color: rgb(var(--color-muted));
  font-size: 0.78rem;
  font-weight: 600;
}

.live-pip {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: rgb(var(--color-primary));
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.14);
}

.hero-nav {
  display: flex;
  flex-shrink: 0;
  gap: 0.4rem;
}

.hero-nav-btn {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid rgb(var(--color-border));
  border-radius: 999px;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-foreground));
  transition: border-color var(--duration-fast) var(--ease-studio), color var(--duration-fast) var(--ease-studio);
}

.hero-nav-btn:hover:not(:disabled) {
  border-color: rgb(var(--color-primary));
  color: rgb(var(--color-primary));
}

.hero-canvas {
  position: relative;
}

.hero-canvas::before {
  content: '';
  position: absolute;
  z-index: 0;
  inset-block: 4% 10%;
  inset-inline: 7% 0;
  background-image:
    linear-gradient(to right, rgb(var(--color-border) / 0.85) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--color-border) / 0.85) 1px, transparent 1px);
  background-size: 3.4rem 3.4rem;
  opacity: 0.55;
  mask-image: linear-gradient(to right, transparent, #000 18%, #000 72%, transparent);
  pointer-events: none;
}

.hero-trace {
  display: none;
}

.trace-svg {
  display: block;
  width: 100%;
  height: 9.2rem;
  color: rgb(var(--color-primary) / 0.55);
}

.trace-svg path {
  stroke: currentColor;
  stroke-width: 1;
}

.trace-svg circle {
  fill: rgb(var(--color-background));
  stroke: currentColor;
  stroke-width: 1;
}

.trace-labels {
  position: absolute;
  inset-inline-start: 1.35rem;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 9.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
  color: rgb(var(--color-subtle));
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

.laptop-enter,
.phone-enter,
.swap,
.swap-item {
  position: relative;
}

.laptop-enter {
  z-index: 1;
}

.phone-slot {
  position: absolute;
  z-index: 3;
  width: 7.35rem;
  inset-inline-end: 4%;
  bottom: 0.2rem;
  filter: drop-shadow(0 18px 28px rgb(17 24 39 / 0.14));
}

.swap-item :deep(.laptop),
.swap-item :deep(.phone) {
  position: relative;
  z-index: 1;
}

.device-hit {
  position: absolute;
  z-index: 2;
  inset: 0;
  border-radius: 0.9rem;
}

.device-hit-phone {
  border-radius: 2rem;
}

.hero-word-enter-active,
.hero-word-leave-active,
.hero-swap-enter-active,
.hero-swap-leave-active,
.phone-swap-enter-active,
.phone-swap-leave-active {
  transition:
    opacity 420ms var(--ease-studio),
    transform 420ms var(--ease-studio);
}

.phone-swap-enter-active {
  transition-delay: 70ms;
}

.hero-word-enter-from,
.hero-word-leave-to {
  opacity: 0;
}

.hero-swap-enter-from,
.phone-swap-enter-from {
  opacity: 0;
  transform: translate3d(var(--swap-x, 1rem), 0, 0) scale(0.988);
}

.hero-swap-leave-to,
.phone-swap-leave-to {
  opacity: 0;
  transform: translate3d(calc(var(--swap-x, 1rem) * -0.65), 0, 0) scale(0.992);
}

.hero-swap-leave-active,
.phone-swap-leave-active {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
}

.hero-swap-leave-active,
.phone-swap-leave-active {
  inset: 0;
  width: 100%;
}

@media (min-width: 640px) {
  .phone-slot {
    width: 10rem;
    inset-inline-end: 6%;
  }
}

@media (min-width: 1080px) {
  .hero-grid {
    grid-template-columns: minmax(18rem, 23.25rem) minmax(0, 1fr);
    gap: 1rem 1.75rem;
  }

  .hero-canvas {
    width: 100%;
    padding-inline-start: 6.35rem;
  }

  .hero-trace {
    position: absolute;
    z-index: 2;
    top: 7%;
    inset-inline-start: 0;
    display: block;
    width: 5.85rem;
    pointer-events: none;
  }

  .phone-slot {
    width: 11.6rem;
    inset-inline-end: 1.35rem;
    bottom: 0.45rem;
  }
}

@media (min-width: 1280px) {
  .hero-canvas {
    width: calc(100% + 1.15rem);
    margin-inline-end: -1.15rem;
  }

  .phone-slot {
    width: 12.35rem;
  }
}

@media (min-width: 1440px) {
  .hero-canvas {
    width: calc(100% + 2.75rem + 1vw);
    margin-inline-end: calc(-2.75rem - 1vw);
  }
}

@media (max-width: 639px) {
  .hero-primary {
    width: 100%;
  }

  .hero-title {
    font-size: clamp(2.05rem, 8.6vw, 2.7rem);
  }
}

html[dir='rtl'] .hero-title,
html[dir='rtl'] .hero-project-name,
html[dir='rtl'] .hero-mark {
  letter-spacing: 0;
}

html[dir='rtl'] .hero-title {
  font-size: clamp(1.9rem, 2.55vw, 2.8rem);
  line-height: 1.38;
}

html[dir='rtl'] .hero-count,
html[dir='rtl'] .trace-labels {
  letter-spacing: 0;
  text-transform: none;
}

html[dir='rtl'] .trace-labels {
  font-size: 0.74rem;
}

html[dir='rtl'] .hero-stage {
  --hero-enter-x: -1.7rem;
}

html[dir='rtl'] .trace-svg {
  transform: scaleX(-1);
}

html[dir='rtl'] .hero-canvas::before {
  mask-image: linear-gradient(to left, transparent, #000 14%, #000 78%, transparent);
}

:global(html[data-theme='dark']) .hero-mark {
  color: rgb(var(--color-primary) / 0.28);
}

:global(html[data-theme='dark']) .phone-slot {
  filter: drop-shadow(0 16px 28px rgb(0 0 0 / 0.35));
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .laptop-enter :deep(img.screen-media) {
    transition: transform 680ms var(--ease-studio);
  }

  .hero-stage:hover .laptop-enter :deep(img.screen-media) {
    transform: scale(1.035) translateY(-1.2%);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero-enter-meta {
    animation: hero-fade 560ms var(--ease-studio) 260ms both;
  }

  .hero-enter-trace {
    animation: hero-fade 700ms var(--ease-studio) 220ms both;
  }

  .laptop-enter {
    animation: hero-device-in 720ms var(--ease-studio) 120ms both;
  }

  .phone-enter {
    animation: hero-device-in 760ms var(--ease-studio) 240ms both;
  }
}

@keyframes hero-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes hero-device-in {
  from {
    opacity: 0;
    transform: translate3d(var(--hero-enter-x, 1.7rem), 0.7rem, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
