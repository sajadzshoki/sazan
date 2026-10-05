<script setup lang="ts">
const localePath = useLocalePath();
const { locale } = useI18n();
const { featuredProjects, projects } = usePortfolio();
const stage = ref<HTMLElement | null>(null);
const offsetX = ref(0);
const offsetY = ref(0);
const wordIndex = ref(0);

const laptopProject = computed(() => featuredProjects.value.find((project) => project.category !== 'mobileApps') || projects.value[0]);
const phoneProject = computed(() => featuredProjects.value.find((project) => project.category === 'mobileApps') || projects.value.find((project) => project.category === 'mobileApps'));
const rotatingWords = computed(() => locale.value === 'fa'
  ? ['وب', 'اپ', 'فروشگاه', 'محصول', 'API']
  : ['web', 'app', 'shop', 'product', 'api']);
const fixedMark = computed(() => locale.value === 'fa' ? 'سازان' : 'SAZAN');
const activeWord = computed(() => rotatingWords.value[wordIndex.value] || rotatingWords.value[0]);

const onPointerMove = (event: PointerEvent) => {
  if (!stage.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const rect = stage.value.getBoundingClientRect();
  offsetX.value = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
  offsetY.value = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
};

const resetOffset = () => {
  offsetX.value = 0;
  offsetY.value = 0;
};

let wordTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  wordTimer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % rotatingWords.value.length;
  }, 2200);
});

onBeforeUnmount(() => {
  if (wordTimer) {
    clearInterval(wordTimer);
  }
});
</script>

<template>
  <section class="sazan-section overflow-hidden pt-10 sm:pt-14" @pointerleave="resetOffset">
    <BaseContainer>
      <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <div>
          <p class="sazan-eyebrow motion-fade-up">
            {{ $t('studio.hero.eyebrow') }}
          </p>
          <div class="hero-mark motion-fade-up motion-delay-1">
            <span class="hero-mark-back" aria-hidden="true">
              <Transition name="hero-word">
                <span :key="activeWord" class="hero-mark-word">{{ activeWord }}</span>
              </Transition>
            </span>
            <span class="hero-mark-fixed">{{ fixedMark }}</span>
            <span class="sr-only">{{ fixedMark }} {{ activeWord }}</span>
          </div>
          <h1 class="hero-title motion-fade-up motion-delay-1 mt-5 max-w-xl whitespace-pre-line text-foreground">
            {{ $t('studio.hero.title') }}
          </h1>
          <p class="sazan-body-lg motion-fade-up motion-delay-2 mt-6 max-w-md text-pretty">
            {{ $t('studio.hero.lead') }}
          </p>
          <div class="motion-fade-up motion-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink :to="localePath('/start-a-project')" class="sazan-button-primary">
              {{ $t('common.startProject') }}
              <span class="arrow-icon" aria-hidden="true">→</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/projects')" class="sazan-button-secondary">
              {{ $t('studio.hero.secondaryCta') }}
            </NuxtLink>
          </div>
        </div>

        <div
          ref="stage"
          class="relative min-h-[28rem] sm:min-h-[34rem]"
          @pointermove="onPointerMove"
        >
          <svg class="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 640 520" fill="none" aria-hidden="true">
            <path class="hero-arc" d="M30 430C150 80 470 40 610 250" stroke-width="1.4" />
          </svg>

          <div class="device-float relative z-10 mx-auto w-[92%] max-w-[40rem]">
            <div
              v-if="laptopProject"
              :style="{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }"
            >
            <DeviceFrame
              type="laptop"
              :title="laptopProject.title"
              :caption="$t(`portfolio.categories.${laptopProject.category}`)"
              :src="laptopProject.media?.desktop"
              :alt="laptopProject.title"
            />
            </div>
          </div>

          <div
            v-if="phoneProject"
            class="device-float-delayed absolute end-0 bottom-2 z-20 w-[9.5rem] sm:end-2 sm:w-[11rem]"
          >
            <div :style="{ transform: `translate3d(${offsetX * -0.6}px, ${offsetY * -0.4}px, 0)` }">
              <DeviceFrame
                type="phone"
                :title="phoneProject.title"
                :caption="$t(`portfolio.categories.${phoneProject.category}`)"
                :src="phoneProject.media?.mobile"
                :alt="phoneProject.title"
              />
            </div>
          </div>

          <div
            v-if="laptopProject"
            class="absolute end-0 top-6 z-20 hidden max-w-[11rem] rounded-2xl border border-border bg-surface px-3 py-2 shadow-[var(--shadow-soft)] sm:block"
          >
            <p class="text-[0.65rem] font-bold tracking-[0.14em] text-primary uppercase">
              {{ laptopProject.technologies[0] }}
            </p>
            <p class="mt-1 text-sm font-bold leading-5 text-foreground">
              {{ laptopProject.title }}
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.hero-title {
  font-size: clamp(1.85rem, 3.3vw, 3.05rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.12;
}

.hero-mark {
  position: relative;
  display: block;
  height: 3.35rem;
  margin-top: 0.85rem;
}

.hero-mark-back {
  position: absolute;
  z-index: 0;
  inset-inline-start: 0;
  top: 0;
  display: block;
  color: rgb(var(--color-primary) / 0.22);
  font-size: clamp(2.35rem, 4vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 0.9;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.hero-mark-word {
  display: block;
}

.hero-mark-fixed {
  position: absolute;
  z-index: 1;
  inset-inline-start: 0.2rem;
  bottom: 0.15rem;
  color: rgb(var(--color-foreground));
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  font-weight: 800;
  letter-spacing: 0.18em;
  line-height: 1;
}

.hero-word-enter-active,
.hero-word-leave-active {
  transition: opacity 380ms var(--ease-studio), transform 380ms var(--ease-studio);
}

.hero-word-enter-from {
  opacity: 0;
  transform: translateY(0.55rem);
}

.hero-word-leave-to {
  opacity: 0;
  transform: translateY(-0.55rem);
}

.hero-word-leave-active {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
}

html[dir='rtl'] .hero-title {
  letter-spacing: 0;
  line-height: 1.4;
  font-size: clamp(1.65rem, 2.8vw, 2.55rem);
}

html[dir='rtl'] .hero-mark-fixed {
  letter-spacing: 0;
  font-size: 1.35rem;
}

html[dir='rtl'] .hero-mark-back {
  letter-spacing: 0;
}

:global(html[data-theme='dark']) .hero-mark-back {
  color: rgb(var(--color-primary) / 0.55);
}
</style>
