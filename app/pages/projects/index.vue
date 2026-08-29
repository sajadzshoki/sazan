<script setup lang="ts">
import { isPortfolioFilterKey, type PortfolioFilterKey } from '~/data/projects';

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { filters, projects, getCategoryLabel } = usePortfolio();
const { formatDigits } = useLocaleDigits();

const selectedFilter = computed<PortfolioFilterKey>(() => {
  const category = route.query.category;
  const categoryValue = Array.isArray(category) ? category[0] : category;

  return isPortfolioFilterKey(categoryValue) ? categoryValue : 'all';
});

const filteredProjects = computed(() => {
  if (selectedFilter.value === 'all') {
    return projects.value;
  }

  return projects.value.filter((project) => project.category === selectedFilter.value);
});

const activeCategoryLabel = computed(() => getCategoryLabel(selectedFilter.value));
const projectCount = computed(() => formatDigits(filteredProjects.value.length));
const totalProjectCount = computed(() => formatDigits(projects.value.length));

const getFilterCount = (filter: PortfolioFilterKey) => {
  if (filter === 'all') {
    return totalProjectCount.value;
  }

  return formatDigits(projects.value.filter((project) => project.category === filter).length);
};

const selectFilter = async (filter: PortfolioFilterKey) => {
  await navigateTo({
    path: localePath('/projects'),
    query: filter === 'all' ? {} : { category: filter }
  });
};

useSeoMeta({
  title: () => t('portfolio.seo.title'),
  ogTitle: () => t('portfolio.seo.title'),
  description: () => t('portfolio.seo.description'),
  ogDescription: () => t('portfolio.seo.description')
});
</script>

<template>
  <div>
    <section class="sazan-section-tight border-b border-border">
      <BaseContainer>
        <div class="grid gap-9 lg:grid-cols-[0.68fr_0.32fr] lg:items-end lg:gap-10">
          <div>
            <p class="sazan-eyebrow motion-fade-up">
              {{ t('portfolio.hero.eyebrow') }}
            </p>
            <h1 class="sazan-display motion-fade-up motion-delay-1 mt-7 max-w-5xl text-balance text-foreground sm:mt-8">
              {{ t('portfolio.hero.title') }}
            </h1>
          </div>

          <div class="motion-fade-up motion-delay-2 grid gap-6 lg:justify-items-end lg:gap-7 lg:text-end">
            <p class="sazan-body-lg max-w-md text-pretty">
              {{ t('portfolio.hero.lead') }}
            </p>
            <div class="grid w-full max-w-xs grid-cols-2 border border-border bg-surface shadow-[var(--shadow-soft)]">
              <div class="border-e border-border p-4">
                <p class="text-3xl font-black tracking-[-0.06em] text-foreground">
                  {{ totalProjectCount }}
                </p>
                <p class="mt-1 text-xs font-bold text-muted">
                  {{ t('portfolio.hero.countLabel') }}
                </p>
              </div>
              <div class="p-4">
                <p class="text-3xl font-black tracking-[-0.06em] text-primary">
                  {{ projectCount }}
                </p>
                <p class="mt-1 text-xs font-bold text-muted">
                  {{ activeCategoryLabel }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section class="border-b border-border bg-surface/38">
      <BaseContainer>
        <div class="filter-panel flex gap-2 overflow-x-auto py-3 sm:py-4" role="group" :aria-label="t('portfolio.filters.label')">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            class="sazan-focus group min-w-[8.5rem] shrink-0 border px-4 py-3 text-start transition sm:min-w-[9.25rem] sm:px-5"
            :class="selectedFilter === filter
              ? 'border-primary bg-background text-foreground shadow-sm'
              : 'border-transparent text-muted hover:border-border hover:bg-background/70 hover:text-foreground'"
            :aria-pressed="selectedFilter === filter"
            @click="selectFilter(filter)"
          >
            <span class="block text-sm font-black">
              {{ getCategoryLabel(filter) }}
            </span>
            <span class="mt-1 block text-xs font-bold text-muted">
              {{ getFilterCount(filter) }}
            </span>
          </button>
        </div>
      </BaseContainer>
    </section>

    <section class="sazan-section">
      <BaseContainer>
        <div class="mb-9 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <p class="sazan-meta">
            {{ t('portfolio.listing.showing', { count: projectCount, category: activeCategoryLabel }) }}
          </p>
          <p class="max-w-lg text-sm leading-7 text-muted md:text-end">
            {{ t('portfolio.listing.note') }}
          </p>
        </div>

        <TransitionGroup name="portfolio-grid" tag="div" class="grid gap-x-8 gap-y-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
          <PortfolioProjectCard
            v-for="(project, index) in filteredProjects"
            :key="project.slug"
            :project="project"
            :index="index"
          />
        </TransitionGroup>

        <div v-if="filteredProjects.length === 0" class="border border-border bg-surface p-8 text-center">
          <h2 class="text-2xl font-black text-foreground">
            {{ t('portfolio.empty.title') }}
          </h2>
          <p class="mt-3 text-muted">
            {{ t('portfolio.empty.description') }}
          </p>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.portfolio-grid-move,
.portfolio-grid-enter-active,
.portfolio-grid-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.portfolio-grid-enter-from,
.portfolio-grid-leave-to {
  opacity: 0;
  transform: translateY(0.8rem);
}
</style>
