<script setup lang="ts">
import { credibilityGroups } from '~/data/home';
import type { TechKey } from '~/data/tech';

const logoFor: Record<string, TechKey> = {
  Nuxt: 'nuxt',
  Vue: 'vue',
  TypeScript: 'typescript',
  'Node.js': 'node',
  AdonisJS: 'adonis',
  PostgreSQL: 'postgres',
  MongoDB: 'mongo',
  Docker: 'docker',
  Nginx: 'nginx'
};
</script>

<template>
  <section class="sazan-section border-t border-border">
    <BaseContainer>
      <div class="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-12">
        <div>
          <p class="sazan-eyebrow">
            {{ $t('studio.stack.eyebrow') }}
          </p>
          <h2 class="mt-4 max-w-md text-3xl font-extrabold tracking-[-0.03em] text-balance text-foreground sm:text-4xl">
            {{ $t('studio.stack.title') }}
          </h2>
          <p class="mt-4 max-w-md text-base leading-7 text-muted">
            {{ $t('studio.stack.lead') }}
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <article v-for="group in credibilityGroups" :key="group.key" class="stack-card">
            <h3>{{ $t(`studio.stack.groups.${group.key}`) }}</h3>
            <ul>
              <li v-for="item in group.items" :key="item">
                <TechMark v-if="logoFor[item]" :tech="logoFor[item]" />
                <span v-else class="stack-plain">{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<style scoped>
.stack-card {
  padding: 1rem 1rem 0.9rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.15rem;
  background: rgb(var(--color-surface));
}

.stack-card h3 {
  color: rgb(var(--color-primary));
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stack-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.stack-plain {
  display: inline-flex;
  align-items: center;
  min-height: 2.35rem;
  padding-inline: 0.75rem;
  border: 1px solid rgb(var(--color-border));
  border-radius: 999px;
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
  font-size: 0.78rem;
  font-weight: 700;
}

html[dir='rtl'] .stack-card h3 {
  letter-spacing: 0;
  text-transform: none;
  font-size: 0.84rem;
}
</style>
