<script setup lang="ts">
const { featuredProjects, projects } = usePortfolio();
const showcase = computed(() => featuredProjects.value.length ? featuredProjects.value : projects.value.slice(0, 6));
</script>

<template>
  <section id="work" class="work-band border-t border-border bg-soft/70">
    <BaseContainer>
      <div class="work-intro">
        <div>
          <p class="sazan-eyebrow">
            {{ $t('studio.work.eyebrow') }}
          </p>
          <h2 class="work-title">
            {{ $t('studio.work.title') }}
          </h2>
        </div>
        <p class="work-lead">
          {{ $t('studio.work.lead') }}
        </p>
      </div>

      <ProjectCarousel :projects="showcase" />
    </BaseContainer>
  </section>
</template>

<style scoped>
.work-band {
  padding-block: clamp(2.4rem, 4.2vw, 3.6rem);
}

.work-intro {
  display: grid;
  gap: 0.7rem;
  max-width: 44rem;
  margin-bottom: 1.15rem;
}

.work-title {
  margin-top: 0.55rem;
  color: rgb(var(--color-foreground));
  font-size: clamp(1.7rem, 2.8vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.12;
  text-wrap: balance;
}

.work-lead {
  max-width: 28rem;
  color: rgb(var(--color-muted));
  font-size: 0.92rem;
  line-height: 1.6;
}

html[dir='rtl'] .work-title {
  letter-spacing: 0;
  line-height: 1.4;
}

@media (min-width: 900px) {
  .work-intro {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    align-items: end;
    gap: 0.85rem 1.35rem;
  }
}
</style>
