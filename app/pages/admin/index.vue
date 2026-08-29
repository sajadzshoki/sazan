<script setup lang="ts">
import type { Project, ProjectRequest } from '~~/types';

defineI18nRoute(false);
definePageMeta({ layout: 'admin' });

const { t } = useI18n();
const { localize, formatDate, publishStatusLabel, publishStatusClass, requestStatusLabel, requestStatusClass } = useAdminHelpers();

const { data, pending, error, refresh } = await useFetch<{
  counts: Record<string, number>;
  data: { provider: string };
  media: { provider: string; minio?: { configured: boolean; bucket: string } };
  recentProjects: Project[];
  recentRequests: ProjectRequest[];
}>('/api/admin/dashboard');

const countCards = computed(() => [
  { label: t('admin.dashboard.cards.projects'), value: data.value?.counts.projects || 0, tone: 'text-foreground' },
  { label: t('admin.dashboard.cards.published'), value: data.value?.counts.publishedProjects || 0, tone: 'text-accent' },
  { label: t('admin.dashboard.cards.requests'), value: data.value?.counts.projectRequests || 0, tone: 'text-foreground' },
  { label: t('admin.dashboard.cards.newRequests'), value: data.value?.counts.newProjectRequests || 0, tone: 'text-primary' }
]);

useHead({ title: () => t('admin.nav.dashboard') });
</script>

<template>
  <div class="grid gap-6">
    <div v-if="error" class="admin-alert admin-alert-error">
      {{ t('admin.states.loadError') }}
      <button class="sazan-text-link ms-2" type="button" @click="refresh()">
        {{ t('admin.actions.retry') }}
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in countCards" :key="card.label" class="admin-card p-5">
        <p class="text-sm font-bold text-muted">{{ card.label }}</p>
        <p class="mt-4 text-4xl font-black tracking-[-0.07em]" :class="card.tone">
          {{ pending ? '…' : card.value }}
        </p>
      </article>
    </div>

    <section class="grid gap-4 lg:grid-cols-2">
      <article class="admin-card p-5">
        <div class="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-black">{{ t('admin.dashboard.recentProjects') }}</h2>
            <p class="mt-1 text-sm text-muted">{{ t('admin.dashboard.projectHint') }}</p>
          </div>
          <NuxtLink to="/admin/projects" class="sazan-button-secondary">
            {{ t('admin.actions.manage') }}
          </NuxtLink>
        </div>

        <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
        <div v-else-if="!data?.recentProjects?.length" class="admin-empty">{{ t('admin.states.empty') }}</div>
        <ul v-else class="divide-y divide-border">
          <li v-for="project in data.recentProjects" :key="project.id" class="py-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="font-black">{{ localize(project.title) }}</p>
                <p class="mt-1 text-xs text-muted">/{{ project.slug }} · {{ formatDate(project.updatedAt) }}</p>
              </div>
              <span class="admin-badge" :class="publishStatusClass(project.status)">
                {{ publishStatusLabel(project.status) }}
              </span>
            </div>
          </li>
        </ul>
      </article>

      <article class="admin-card p-5">
        <div class="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-black">{{ t('admin.dashboard.recentRequests') }}</h2>
            <p class="mt-1 text-sm text-muted">{{ t('admin.dashboard.requestHint') }}</p>
          </div>
          <NuxtLink to="/admin/requests" class="sazan-button-secondary">
            {{ t('admin.actions.review') }}
          </NuxtLink>
        </div>

        <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
        <div v-else-if="!data?.recentRequests?.length" class="admin-empty">{{ t('admin.states.empty') }}</div>
        <ul v-else class="divide-y divide-border">
          <li v-for="request in data.recentRequests" :key="request.id" class="py-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="font-black">{{ request.contact.fullName }}</p>
                <p class="mt-1 text-xs text-muted">{{ request.contact.email }} · {{ formatDate(request.createdAt) }}</p>
              </div>
              <span class="admin-badge" :class="requestStatusClass(request.status)">
                {{ requestStatusLabel(request.status) }}
              </span>
            </div>
          </li>
        </ul>
      </article>
    </section>

    <section class="admin-card p-5">
      <h2 class="text-xl font-black">{{ t('admin.dashboard.system') }}</h2>
      <dl class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-border bg-background p-4">
          <dt class="text-xs font-bold text-muted">{{ t('admin.dashboard.dataProvider') }}</dt>
          <dd class="mt-2 font-black">{{ data?.data.provider || '—' }}</dd>
        </div>
        <div class="rounded-2xl border border-border bg-background p-4">
          <dt class="text-xs font-bold text-muted">{{ t('admin.dashboard.mediaProvider') }}</dt>
          <dd class="mt-2 font-black">{{ data?.media.provider || '—' }}</dd>
        </div>
        <div class="rounded-2xl border border-border bg-background p-4">
          <dt class="text-xs font-bold text-muted">{{ t('admin.dashboard.minio') }}</dt>
          <dd class="mt-2 font-black">{{ data?.media.minio?.configured ? t('admin.states.configured') : t('admin.states.notConfigured') }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>
