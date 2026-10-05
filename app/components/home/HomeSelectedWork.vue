<script setup lang="ts">
const { featuredProjects, projects } = usePortfolio();
const showcase = computed(() => featuredProjects.value.length ? featuredProjects.value : projects.value.slice(0, 6));
</script>

<template>
  <section id="work" class="sazan-section border-t border-border bg-soft/70">
    <BaseContainer>
      <div class="mb-10 grid gap-6 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
        <div>
          <p class="sazan-eyebrow">
            {{ $t('studio.work.eyebrow') }}
          </p>
          <h2 class="sazan-heading-xl mt-5 max-w-3xl text-balance text-foreground">
            {{ $t('studio.work.title') }}
          </h2>
        </div>
        <p class="sazan-body-lg max-w-sm lg:justify-self-end">
          {{ $t('studio.work.lead') }}
        </p>
      </div>

      <ProjectCarousel :projects="showcase" />
    </BaseContainer>
  </section>
</template>
