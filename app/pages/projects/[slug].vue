<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { formatDigits } = useLocaleDigits();
const { getProjectBySlug, getRelatedProjects } = usePortfolio();

const routeSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
const slug = String(routeSlug || '');
const initialProject = getProjectBySlug(slug);

if (!initialProject) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found'
  });
}

const project = computed(() => getProjectBySlug(slug) || initialProject);
const categoryLabel = computed(() => t(`portfolio.categories.${project.value.category}`));
const serviceLabels = computed(() => project.value.services.map((service) => t(`home.services.items.${service}.title`)));
const relatedProjects = computed(() => getRelatedProjects(project.value.raw, 3));

const projectLinks = computed(() => {
  const links: Array<{ label: string; url: string }> = [];

  if (project.value.projectUrl) {
    links.push({ label: t('portfolio.detail.links.viewProduct'), url: project.value.projectUrl });
  }

  if (project.value.demoUrl) {
    links.push({ label: t('portfolio.detail.links.openDemo'), url: project.value.demoUrl });
  }

  return links;
});

useSeoMeta({
  title: () => project.value.title,
  ogTitle: () => project.value.title,
  description: () => project.value.shortDescription,
  ogDescription: () => project.value.shortDescription
});
</script>

<template>
  <article>
    <section class="case-study-hero relative overflow-hidden border-b border-border">
      <BaseContainer>
        <div class="grid gap-12 py-12 lg:grid-cols-[0.58fr_0.42fr] lg:items-end lg:py-20">
          <div>
            <NuxtLink :to="localePath('/projects')" class="sazan-text-link text-sm">
              {{ t('portfolio.detail.backToProjects') }}
            </NuxtLink>

            <p class="sazan-eyebrow motion-fade-up mt-10">
              {{ categoryLabel }} / {{ formatDigits(project.year) }}
            </p>

            <h1 class="sazan-heading-xl motion-fade-up motion-delay-1 mt-6 max-w-5xl text-balance text-foreground">
              {{ project.title }}
            </h1>

            <p class="sazan-body-lg motion-fade-up motion-delay-2 mt-7 max-w-3xl text-pretty">
              {{ project.shortDescription }}
            </p>

            <div class="motion-fade-up motion-delay-3 mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:max-w-3xl">
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="service in serviceLabels"
                  :key="service"
                  class="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-bold text-muted"
                >
                  {{ service }}
                </li>
              </ul>

              <div v-if="projectLinks.length" class="flex flex-wrap gap-3">
                <a
                  v-for="link in projectLinks"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sazan-button-secondary py-2.5"
                >
                  {{ link.label }}
                </a>
              </div>
            </div>
          </div>

          <PortfolioVisual
            :visual="project.coverVisual"
            :label="t('portfolio.detail.heroVisualLabel')"
            :title="project.title"
            class="motion-fade-up motion-delay-2 min-h-[32rem] lg:min-h-[42rem]"
          />
        </div>
      </BaseContainer>
    </section>

    <section v-if="project.results.length" class="border-b border-border bg-foreground text-background">
      <BaseContainer>
        <div class="grid divide-y divide-background/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div v-for="result in project.results" :key="result.label" class="py-7 sm:px-7 sm:first:ps-0 sm:last:pe-0">
            <p class="text-4xl font-black tracking-[-0.07em]">
              {{ result.value }}
            </p>
            <p class="mt-2 text-sm leading-6 text-background/62">
              {{ result.label }}
            </p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section class="sazan-section">
      <BaseContainer>
        <div class="grid gap-12 lg:grid-cols-[minmax(0,0.66fr)_minmax(19rem,0.34fr)] lg:items-start">
          <div>
            <p class="sazan-eyebrow">
              {{ t('portfolio.detail.overview.eyebrow') }}
            </p>
            <h2 class="sazan-heading-lg mt-5 max-w-4xl text-balance text-foreground">
              {{ project.overview }}
            </h2>
            <p class="mt-7 max-w-3xl text-lg leading-8 text-muted">
              {{ project.fullDescription }}
            </p>

            <div class="mt-12 grid gap-8 md:grid-cols-2">
              <div class="border-t border-border pt-5">
                <h3 class="sazan-meta text-foreground">
                  {{ t('portfolio.detail.challenge') }}
                </h3>
                <p class="mt-4 text-base leading-8 text-muted">
                  {{ project.challenge }}
                </p>
              </div>
              <div class="border-t border-border pt-5">
                <h3 class="sazan-meta text-foreground">
                  {{ t('portfolio.detail.solution') }}
                </h3>
                <p class="mt-4 text-base leading-8 text-muted">
                  {{ project.solution }}
                </p>
              </div>
            </div>

            <div class="mt-14">
              <h3 class="sazan-heading-lg text-foreground">
                {{ t('portfolio.detail.features.title') }}
              </h3>
              <ol class="mt-8 border-y border-border">
                <li
                  v-for="(feature, index) in project.keyFeatures"
                  :key="feature"
                  class="grid gap-5 border-b border-border py-6 last:border-b-0 sm:grid-cols-[5rem_1fr]"
                >
                  <span class="service-index text-2xl">
                    {{ formatDigits(String(index + 1).padStart(2, '0')) }}
                  </span>
                  <span class="max-w-2xl text-xl font-bold leading-8 text-foreground">
                    {{ feature }}
                  </span>
                </li>
              </ol>
            </div>
          </div>

          <PortfolioProjectDetailsPanel :project="project" class="lg:sticky lg:top-28" />
        </div>
      </BaseContainer>
    </section>

    <PortfolioProjectGallery :items="project.gallery" />

    <PortfolioProjectVideo v-if="project.video" :video="project.video" />

    <section class="sazan-section-tight border-y border-border bg-surface/38">
      <BaseContainer>
        <div class="grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <div>
            <p class="sazan-eyebrow">
              {{ t('portfolio.detail.technologies.eyebrow') }}
            </p>
            <h2 class="sazan-heading-lg mt-5 text-foreground">
              {{ t('portfolio.detail.technologies.title') }}
            </h2>
          </div>

          <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li
              v-for="technology in project.technologies"
              :key="technology"
              class="flex items-center justify-between border border-border bg-background px-4 py-4 text-sm font-bold text-foreground"
            >
              <span>{{ technology }}</span>
              <span class="text-primary" aria-hidden="true">+</span>
            </li>
          </ul>
        </div>
      </BaseContainer>
    </section>

    <PortfolioRelatedProjects :projects="relatedProjects" />
  </article>
</template>
