<script setup lang="ts">
import type { LocalizedPortfolioProject } from '~/composables/usePortfolio';
import { previewDevicesFor, screenshotFor, type DeviceType } from '~/utils/presentation';

const props = defineProps<{
  projects: LocalizedPortfolioProject[];
}>();

const localePath = useLocalePath();
const { t } = useI18n();
const { isRtl } = useAppDirection();
const { formatDigits } = useLocaleDigits();

const activeIndex = ref(0);
const live = ref(true);
const device = ref<DeviceType>('laptop');
const viewportScale = ref(100);
const stageRef = ref<HTMLElement | null>(null);
const viewportPx = ref(0);
const userPaused = ref(false);
const isCompact = ref(false);
const slideDirection = ref(1);
const swapMotion = ref(false);
const reducedMotion = ref(false);

const count = computed(() => props.projects.length);
const current = computed(() => props.projects[activeIndex.value]);
const previous = computed(() => props.projects[(activeIndex.value - 1 + count.value) % count.value]);
const next = computed(() => props.projects[(activeIndex.value + 1) % count.value]);
const devices = computed(() => current.value ? previewDevicesFor(current.value.category) : ['laptop' as DeviceType]);
const shownDevice = computed<DeviceType>(() => {
  if (isCompact.value && devices.value.includes('phone')) {
    return device.value === 'laptop' ? 'phone' : device.value;
  }

  return devices.value.includes(device.value) ? device.value : devices.value[0] || 'laptop';
});
const currentSrc = computed(() => screenshotFor(current.value?.media, shownDevice.value));
const liveUrl = computed(() => current.value?.demoUrl || current.value?.projectUrl || '');
const externalUrl = computed(() => current.value?.projectUrl || current.value?.demoUrl || '');
const indexLabel = computed(() => {
  if (!count.value) {
    return '';
  }

  return t('studio.work.count', {
    current: formatDigits(String(activeIndex.value + 1).padStart(2, '0')),
    total: formatDigits(String(count.value).padStart(2, '0'))
  });
});

const measureViewport = () => {
  if (!stageRef.value) {
    return;
  }

  viewportPx.value = Math.round(stageRef.value.clientWidth * (viewportScale.value / 100));
};

const motionName = computed(() => {
  if (swapMotion.value) {
    return 'work-swap';
  }

  return slideDirection.value > 0 ? 'work-next' : 'work-prev';
});

const go = (delta: number) => {
  if (count.value < 2) {
    return;
  }

  swapMotion.value = false;
  slideDirection.value = delta >= 0 ? 1 : -1;
  activeIndex.value = (activeIndex.value + delta + count.value) % count.value;
  userPaused.value = true;
};

const show = (index: number) => {
  if (index === activeIndex.value) {
    return;
  }

  swapMotion.value = false;
  slideDirection.value = index > activeIndex.value ? 1 : -1;
  activeIndex.value = index;
  live.value = false;
  userPaused.value = true;
};

const { embeddable } = useFrameEmbed(liveUrl);

watch(embeddable, (value) => {
  live.value = value;
}, { immediate: true });

const selectDevice = (nextDevice: DeviceType) => {
  if (nextDevice === device.value) {
    return;
  }

  swapMotion.value = true;
  device.value = nextDevice;
  userPaused.value = true;
};

const toggleLive = () => {
  swapMotion.value = true;
  live.value = !live.value;
  userPaused.value = true;
};

let startX = 0;
let startY = 0;
let lock: 'x' | 'y' | null = null;

const onPointerDown = (event: PointerEvent) => {
  if ((event.target as HTMLElement).closest('button, a, input, iframe, label')) {
    return;
  }

  startX = event.clientX;
  startY = event.clientY;
  lock = null;
};

const onPointerMove = (event: PointerEvent) => {
  if (!startX) {
    return;
  }

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  if (!lock && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  }
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

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    go(isRtl.value ? -1 : 1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    go(isRtl.value ? 1 : -1);
  }
};

let timer: ReturnType<typeof setInterval> | undefined;
let compactQuery: MediaQueryList | undefined;
let motionQuery: MediaQueryList | undefined;

const syncQueries = () => {
  isCompact.value = Boolean(compactQuery?.matches);
  reducedMotion.value = Boolean(motionQuery?.matches);
};

onMounted(() => {
  compactQuery = window.matchMedia('(max-width: 767px)');
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncQueries();
  compactQuery.addEventListener('change', syncQueries);
  motionQuery.addEventListener('change', syncQueries);
  measureViewport();
  window.addEventListener('resize', measureViewport);

  timer = setInterval(() => {
    if (userPaused.value || reducedMotion.value || live.value || count.value < 2) {
      return;
    }

    go(1);
    userPaused.value = false;
  }, 8000);
});

onBeforeUnmount(() => {
  compactQuery?.removeEventListener('change', syncQueries);
  motionQuery?.removeEventListener('change', syncQueries);
  window.removeEventListener('resize', measureViewport);
  if (timer) {
    clearInterval(timer);
  }
});

watch(viewportScale, () => measureViewport());
watch(current, (project) => {
  if (!project) {
    return;
  }

  const available = previewDevicesFor(project.category);
  if (!available.includes(device.value)) {
    device.value = available[0] || 'laptop';
  }
});
</script>

<template>
  <section
    v-if="current"
    class="outline-none"
    tabindex="0"
    :aria-roledescription="t('studio.work.carousel')"
    @keydown="onKeydown"
    @mouseenter="userPaused = true"
    @focusin="userPaused = true"
  >
    <div class="mb-3 flex items-center justify-end gap-3">
      <p class="text-xs font-semibold tabular-nums text-muted">
        {{ indexLabel }}
      </p>
      <div class="flex items-center gap-2">
        <button type="button" class="sazan-focus grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary" :aria-label="t('studio.work.previous')" @click="go(-1)">
          <span class="arrow-icon" aria-hidden="true">←</span>
        </button>
        <button type="button" class="sazan-focus grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary" :aria-label="t('studio.work.next')" @click="go(1)">
          <span class="arrow-icon" aria-hidden="true">→</span>
        </button>
      </div>
    </div>

    <div
      ref="stageRef"
      class="relative grid items-center gap-3 md:grid-cols-[minmax(0,0.16fr)_minmax(0,0.68fr)_minmax(0,0.16fr)]"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <Transition name="wing" mode="out-in">
        <button
          v-if="previous && count > 1"
          :key="previous.slug"
          type="button"
          class="wing sazan-focus hidden md:block"
          :aria-label="t('studio.work.previousNamed', { title: previous.title })"
          @click="go(-1)"
        >
          <DeviceFrame
            :type="previous.category === 'mobileApps' ? 'phone' : 'laptop'"
            :title="previous.title"
            :caption="t(`portfolio.categories.${previous.category}`)"
            :src="screenshotFor(previous.media, previous.category === 'mobileApps' ? 'phone' : 'laptop')"
            :alt="previous.title"
          />
        </button>
      </Transition>

        <div class="min-w-0">
        <div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            class="sazan-focus inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.12em] uppercase"
            :class="live && embeddable ? 'border-primary bg-primary text-onPrimary' : 'border-border bg-surface text-foreground'"
            :aria-pressed="live && embeddable"
            :disabled="!embeddable"
            @click="toggleLive"
          >
            <span class="live-dot" :class="live && embeddable ? 'is-on bg-onPrimary' : 'bg-primary'" />
            {{ live && embeddable ? t('studio.work.liveOn') : t('studio.work.live') }}
          </button>

          <div v-if="devices.length > 1" class="flex rounded-full border border-border bg-surface p-1" role="group" :aria-label="t('studio.work.devicesLabel')">
            <button
              v-for="option in devices"
              :key="option"
              type="button"
              class="sazan-focus rounded-full px-3 py-1.5 text-xs font-semibold"
              :class="shownDevice === option ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'"
              :aria-pressed="shownDevice === option"
              @click="selectDevice(option)"
            >
              {{ t(`studio.work.devices.${option}`) }}
            </button>
          </div>
        </div>

        <div class="stage-swap">
          <Transition :name="motionName">
            <div :key="`${current.slug}-${shownDevice}-${live}`" class="stage-slide mx-auto" :style="shownDevice === 'phone' ? undefined : { width: `${viewportScale}%` }">
              <DeviceFrame
                :type="shownDevice"
                :src="currentSrc"
                :alt="current.title"
                :title="current.title"
                :caption="t(`portfolio.categories.${current.category}`)"
                :live-url="liveUrl"
                :live="live && embeddable"
              />
            </div>
          </Transition>
        </div>

        <div v-if="shownDevice !== 'phone'" class="mx-auto mt-2.5 max-w-md">
          <label class="grid gap-2 text-center">
            <span class="text-xs font-semibold text-muted">
              {{ t('studio.work.resize') }}
              <span v-if="viewportPx" class="tabular-nums"> · {{ formatDigits(viewportPx) }}px</span>
            </span>
            <input
              v-model.number="viewportScale"
              class="viewport-range"
              type="range"
              min="58"
              max="100"
              step="1"
              :aria-valuetext="`${viewportPx || viewportScale}px`"
              @pointerdown="userPaused = true"
            >
          </label>
        </div>

        <p class="sr-only" aria-live="polite">
          {{ current.title }}. {{ indexLabel }}
        </p>
      </div>

      <Transition name="wing" mode="out-in">
        <button
          v-if="next && count > 1"
          :key="next.slug"
          type="button"
          class="wing sazan-focus hidden md:block"
          :aria-label="t('studio.work.nextNamed', { title: next.title })"
          @click="go(1)"
        >
          <DeviceFrame
            :type="next.category === 'mobileApps' ? 'phone' : 'laptop'"
            :title="next.title"
            :caption="t(`portfolio.categories.${next.category}`)"
            :src="screenshotFor(next.media, next.category === 'mobileApps' ? 'phone' : 'laptop')"
            :alt="next.title"
          />
        </button>
      </Transition>
    </div>

    <Transition name="work-copy" mode="out-in">
    <div :key="current.slug" class="mx-auto mt-4 max-w-2xl border-t border-border pt-3.5">
      <p class="text-xs font-semibold tabular-nums text-primary">
        {{ indexLabel }}
        <span class="ms-2 font-semibold text-muted">{{ t(`portfolio.categories.${current.category}`) }}</span>
      </p>
      <h3 class="sazan-title-tight mt-1 text-xl font-extrabold text-foreground sm:text-2xl">
        {{ current.title }}
      </h3>
      <p class="mt-1.5 max-w-xl text-sm leading-6 text-muted">
        {{ current.shortDescription }}
      </p>
      <ul class="mt-2.5 flex flex-wrap gap-1.5">
        <li v-for="technology in current.technologies" :key="technology" class="sazan-chip">
          {{ technology }}
        </li>
      </ul>
      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <NuxtLink :to="localePath(`/projects/${current.slug}`)" class="sazan-text-link text-sm">
          {{ t('common.viewCaseStudy') }}
          <span class="arrow-icon" aria-hidden="true">→</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath({ path: '/start-a-project', query: { similar: current.slug } })"
          class="sazan-text-link text-sm"
        >
          {{ t('portfolio.similar.action') }}
        </NuxtLink>
        <a
          v-if="externalUrl"
          :href="externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-semibold text-muted hover:text-primary"
        >
          {{ t('studio.work.openLive') }}
        </a>
      </div>
    </div>
    </Transition>

    <div class="mt-6 flex items-center justify-center gap-2 md:hidden" role="tablist" :aria-label="t('studio.work.carousel')">
      <button
        v-for="(project, index) in projects"
        :key="project.slug"
        type="button"
        class="h-2 rounded-full transition"
        :class="index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-border'"
        :aria-label="project.title"
        :aria-selected="index === activeIndex"
        @click="show(index)"
      />
    </div>
  </section>
</template>

<style scoped>
.viewport-range {
  width: 100%;
  accent-color: rgb(var(--color-primary));
  cursor: ew-resize;
}

.stage-swap {
  display: grid;
  perspective: 1400px;
}

.stage-slide {
  grid-area: 1 / 1;
  transform-origin: 50% 60%;
  backface-visibility: hidden;
}

.live-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
}

.live-dot.is-on {
  animation: live-pulse 1.6s ease-out infinite;
}

.wing {
  opacity: 0.72;
  transition: opacity 180ms ease, transform 280ms var(--ease-studio);
}

.wing:hover {
  opacity: 1;
  transform: scale(1.035);
}

.wing-enter-active,
.wing-leave-active {
  transition: opacity 360ms ease, transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
}

.wing-enter-from,
.wing-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.work-next-enter-active,
.work-prev-enter-active,
.work-swap-enter-active {
  z-index: 2;
  transition: opacity 220ms ease, transform 740ms cubic-bezier(0.16, 1, 0.3, 1);
}

.work-next-leave-active,
.work-prev-leave-active,
.work-swap-leave-active {
  z-index: 1;
  transition: opacity 280ms ease, transform 500ms cubic-bezier(0.4, 0, 1, 1);
}

.work-next-enter-from {
  opacity: 0;
  transform: translate3d(8%, 16px, 0) scale(0.9) rotateY(-9deg);
}

.work-next-leave-to {
  opacity: 0;
  transform: translate3d(-7%, -12px, 0) scale(0.93) rotateY(8deg);
}

.work-prev-enter-from {
  opacity: 0;
  transform: translate3d(-8%, 16px, 0) scale(0.9) rotateY(9deg);
}

.work-prev-leave-to {
  opacity: 0;
  transform: translate3d(7%, -12px, 0) scale(0.93) rotateY(-8deg);
}

.work-swap-enter-from {
  opacity: 0;
  transform: translate3d(0, 12px, 0) scale(0.96);
}

.work-swap-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

.work-copy-enter-active {
  transition: opacity 420ms ease 70ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 50ms;
}

.work-copy-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.work-copy-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.work-copy-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

html[dir='rtl'] .work-next-enter-from {
  transform: translate3d(-8%, 16px, 0) scale(0.9) rotateY(9deg);
}

html[dir='rtl'] .work-next-leave-to {
  transform: translate3d(7%, -12px, 0) scale(0.93) rotateY(-8deg);
}

html[dir='rtl'] .work-prev-enter-from {
  transform: translate3d(8%, 16px, 0) scale(0.9) rotateY(-9deg);
}

html[dir='rtl'] .work-prev-leave-to {
  transform: translate3d(-7%, -12px, 0) scale(0.93) rotateY(8deg);
}

@keyframes live-pulse {
  0% { box-shadow: 0 0 0 0 rgb(255 255 255 / 0.55); }
  70% { box-shadow: 0 0 0 7px rgb(255 255 255 / 0); }
  100% { box-shadow: 0 0 0 0 rgb(255 255 255 / 0); }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot.is-on {
    animation: none;
  }

  .work-next-enter-active,
  .work-next-leave-active,
  .work-prev-enter-active,
  .work-prev-leave-active,
  .work-swap-enter-active,
  .work-swap-leave-active,
  .work-copy-enter-active,
  .work-copy-leave-active,
  .wing-enter-active,
  .wing-leave-active {
    transition: opacity 140ms linear;
  }

  .work-next-enter-from,
  .work-next-leave-to,
  .work-prev-enter-from,
  .work-prev-leave-to,
  .work-swap-enter-from,
  .work-swap-leave-to,
  .work-copy-enter-from,
  .work-copy-leave-to,
  .wing-enter-from,
  .wing-leave-to {
    transform: none;
  }
}
</style>
