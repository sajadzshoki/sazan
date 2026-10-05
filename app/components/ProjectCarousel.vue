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
const live = ref(false);
const device = ref<DeviceType>('laptop');
const viewportScale = ref(100);
const stageRef = ref<HTMLElement | null>(null);
const viewportPx = ref(0);
const userPaused = ref(false);
const isCompact = ref(false);
const slideDirection = ref(1);
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

const go = (delta: number) => {
  if (count.value < 2) {
    return;
  }

  slideDirection.value = delta >= 0 ? 1 : -1;
  activeIndex.value = (activeIndex.value + delta + count.value) % count.value;
  live.value = false;
  userPaused.value = true;
};

const selectDevice = (nextDevice: DeviceType) => {
  device.value = nextDevice;
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
    <div class="mb-6 flex items-center justify-between gap-4">
      <p class="text-sm font-semibold tabular-nums text-muted">
        {{ indexLabel }}
      </p>
      <div class="flex items-center gap-2">
        <button type="button" class="sazan-focus grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary" :aria-label="t('studio.work.previous')" @click="go(-1)">
          <span class="arrow-icon" aria-hidden="true">←</span>
        </button>
        <button type="button" class="sazan-focus grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary" :aria-label="t('studio.work.next')" @click="go(1)">
          <span class="arrow-icon" aria-hidden="true">→</span>
        </button>
      </div>
    </div>

    <div
      ref="stageRef"
      class="relative grid items-center gap-4 md:grid-cols-[minmax(0,0.18fr)_minmax(0,0.64fr)_minmax(0,0.18fr)]"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <button
        v-if="previous && count > 1"
        type="button"
        class="sazan-focus hidden opacity-70 transition hover:opacity-100 md:block"
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

      <div class="min-w-0">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            class="sazan-focus inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.12em] uppercase"
            :class="live ? 'border-primary bg-primary text-onPrimary' : 'border-border bg-surface text-foreground'"
            :aria-pressed="live"
            :disabled="!liveUrl"
            @click="live = !live"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="live ? 'bg-onPrimary' : 'bg-primary'" />
            {{ live ? t('studio.work.liveOn') : t('studio.work.live') }}
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

        <Transition :name="slideDirection > 0 ? 'work-next' : 'work-prev'" mode="out-in">
          <div :key="`${current.slug}-${shownDevice}-${live}`" class="mx-auto" :style="shownDevice === 'phone' ? undefined : { width: `${viewportScale}%` }">
            <DeviceFrame
              :type="shownDevice"
              :src="currentSrc"
              :alt="current.title"
              :title="current.title"
              :caption="t(`portfolio.categories.${current.category}`)"
              :live-url="liveUrl"
              :live="live"
            />
          </div>
        </Transition>

        <div v-if="shownDevice !== 'phone'" class="mx-auto mt-4 max-w-md">
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

      <button
        v-if="next && count > 1"
        type="button"
        class="sazan-focus hidden opacity-70 transition hover:opacity-100 md:block"
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
    </div>

    <div class="mx-auto mt-8 grid max-w-3xl gap-5 border-t border-border pt-6 md:grid-cols-[auto_1fr_auto] md:items-end">
      <p class="text-sm font-semibold tabular-nums text-primary">
        {{ indexLabel }}
      </p>
      <div>
        <p class="text-sm font-semibold text-muted">
          {{ t(`portfolio.categories.${current.category}`) }}
        </p>
        <h3 class="sazan-title-tight mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
          {{ current.title }}
        </h3>
        <p class="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
          {{ current.shortDescription }}
        </p>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li v-for="technology in current.technologies" :key="technology" class="sazan-chip">
            {{ technology }}
          </li>
        </ul>
      </div>
      <div class="flex flex-col items-start gap-3 md:items-end">
        <NuxtLink :to="localePath(`/projects/${current.slug}`)" class="sazan-text-link text-sm">
          {{ t('common.viewCaseStudy') }}
          <span class="arrow-icon" aria-hidden="true">→</span>
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

    <div class="mt-6 flex items-center justify-center gap-2 md:hidden" role="tablist" :aria-label="t('studio.work.carousel')">
      <button
        v-for="(project, index) in projects"
        :key="project.slug"
        type="button"
        class="h-2 rounded-full transition"
        :class="index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-border'"
        :aria-label="project.title"
        :aria-selected="index === activeIndex"
        @click="activeIndex = index; live = false; userPaused = true"
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

.work-next-enter-active,
.work-next-leave-active,
.work-prev-enter-active,
.work-prev-leave-active {
  transition: opacity 420ms var(--ease-studio), transform 420ms var(--ease-studio);
}

.work-next-enter-from,
.work-prev-leave-to {
  opacity: 0;
  transform: translateX(1.5rem) scale(0.985);
}

.work-next-leave-to,
.work-prev-enter-from {
  opacity: 0;
  transform: translateX(-1.5rem) scale(0.985);
}

html[dir='rtl'] .work-next-enter-from,
html[dir='rtl'] .work-prev-leave-to {
  transform: translateX(-1.5rem) scale(0.985);
}

html[dir='rtl'] .work-next-leave-to,
html[dir='rtl'] .work-prev-enter-from {
  transform: translateX(1.5rem) scale(0.985);
}
</style>
