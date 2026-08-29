<script setup lang="ts">
import { budgetOptions, featureOptions, preferredContactOptions, projectTypeOptions, timelineOptions } from '~/data/lead';
import type { ProjectRequest, ProjectRequestStatus } from '~~/types';

defineI18nRoute(false);
definePageMeta({ layout: 'admin' });

const { t } = useI18n();
const { formatDate, requestStatusLabel, requestStatusClass } = useAdminHelpers();

const { data, pending, error, refresh } = await useFetch<{ requests: ProjectRequest[] }>('/api/admin/requests');
const requests = computed(() => data.value?.requests || []);
const selectedId = ref('');
const statusFilter = ref<'all' | ProjectRequestStatus>('all');
const isUpdating = ref(false);
const isDeleting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const statusOptions = ['new', 'reviewing', 'contacted', 'inProgress', 'completed', 'archived'] as const;
const filterOptions = computed(() => ['all', ...statusOptions] as const);

const filteredRequests = computed(() => statusFilter.value === 'all'
  ? requests.value
  : requests.value.filter((request) => request.status === statusFilter.value));

const selectedRequest = computed(() => requests.value.find((request) => request.id === selectedId.value) || filteredRequests.value[0]);

watch(filteredRequests, (items) => {
  if (!items.some((request) => request.id === selectedId.value)) {
    selectedId.value = items[0]?.id || '';
  }
}, { immediate: true });

const labelFor = <T extends string>(options: readonly { value: T; labelKey: string }[], value?: T) => {
  const option = options.find((item) => item.value === value);
  return option ? t(option.labelKey) : value || '—';
};

const labelsFor = <T extends string>(options: readonly { value: T; labelKey: string }[], values: readonly T[] = []) => {
  const labels = values.map((value) => labelFor(options, value));
  return labels.length ? labels : ['—'];
};

const updateStatus = async (request: ProjectRequest, status: ProjectRequestStatus) => {
  if (!request.id) {
    return;
  }

  isUpdating.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await $fetch(`/api/admin/requests/${request.id}`, {
      method: 'PATCH',
      body: { status }
    });
    await refresh();
    selectedId.value = request.id;
    successMessage.value = t('admin.states.saved');
  } catch {
    errorMessage.value = t('admin.states.saveError');
  } finally {
    isUpdating.value = false;
  }
};

const onStatusChange = async (request: ProjectRequest, event: Event) => {
  const target = event.target as HTMLSelectElement;
  await updateStatus(request, target.value as ProjectRequestStatus);
};

const archiveRequest = async (request: ProjectRequest) => {
  await updateStatus(request, 'archived');
};

const deleteRequest = async (request: ProjectRequest) => {
  if (!request.id || !confirm(t('admin.confirm.deleteRequest', { title: request.contact.fullName }))) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/admin/requests/${request.id}`, { method: 'DELETE' });
    await refresh();
    selectedId.value = filteredRequests.value[0]?.id || '';
  } catch {
    errorMessage.value = t('admin.states.deleteError');
  } finally {
    isDeleting.value = false;
  }
};

useHead({ title: () => t('admin.nav.requests') });
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
    <section class="admin-card overflow-hidden">
      <div class="border-b border-border p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-black">{{ t('admin.requests.title') }}</h2>
            <p class="mt-1 text-sm text-muted">{{ t('admin.requests.description') }}</p>
          </div>
          <button class="sazan-button-secondary" type="button" @click="refresh()">{{ t('admin.actions.refresh') }}</button>
        </div>
        <div class="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="status in filterOptions"
            :key="status"
            type="button"
            class="admin-filter"
            :class="statusFilter === status ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-foreground'"
            @click="statusFilter = status"
          >
            {{ status === 'all' ? t('admin.filters.all') : requestStatusLabel(status) }}
          </button>
        </div>
      </div>

      <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
      <div v-else-if="error" class="admin-empty text-primary">{{ t('admin.states.loadError') }}</div>
      <div v-else-if="!filteredRequests.length" class="admin-empty">{{ t('admin.states.empty') }}</div>
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>{{ t('admin.fields.contact') }}</th>
              <th>{{ t('admin.fields.status') }}</th>
              <th>{{ t('admin.fields.budget') }}</th>
              <th>{{ t('admin.fields.createdAt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="request in filteredRequests"
              :key="request.id"
              class="cursor-pointer"
              :class="selectedRequest?.id === request.id ? 'bg-primary/6' : ''"
              @click="selectedId = request.id || ''"
            >
              <td>
                <p class="font-black">{{ request.contact.fullName }}</p>
                <p class="mt-1 text-xs text-muted">{{ request.contact.email }}</p>
              </td>
              <td><span class="admin-badge" :class="requestStatusClass(request.status)">{{ requestStatusLabel(request.status) }}</span></td>
              <td>{{ labelFor(budgetOptions, request.budgetRange) }}</td>
              <td>{{ formatDate(request.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-card p-5">
      <div v-if="!selectedRequest" class="admin-empty">{{ t('admin.requests.selectEmpty') }}</div>
      <template v-else>
        <div class="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="sazan-meta">{{ selectedRequest.id }}</p>
            <h2 class="mt-2 text-2xl font-black tracking-[-0.05em]">{{ selectedRequest.contact.fullName }}</h2>
            <p class="mt-2 text-sm text-muted">{{ selectedRequest.contact.email }}</p>
          </div>
          <span class="admin-badge" :class="requestStatusClass(selectedRequest.status)">{{ requestStatusLabel(selectedRequest.status) }}</span>
        </div>

        <dl class="mt-5 grid gap-4 md:grid-cols-2">
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.company') }}</dt>
            <dd>{{ selectedRequest.contact.company || '—' }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.phone') }}</dt>
            <dd>{{ selectedRequest.contact.phone || '—' }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.preferredContact') }}</dt>
            <dd>{{ labelFor(preferredContactOptions, selectedRequest.contact.preferredContactMethod) }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.locale') }}</dt>
            <dd>{{ selectedRequest.preferredLocale.toUpperCase() }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.budget') }}</dt>
            <dd>{{ labelFor(budgetOptions, selectedRequest.budgetRange) }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.timeline') }}</dt>
            <dd>{{ labelFor(timelineOptions, selectedRequest.timeline) }}</dd>
          </div>
        </dl>

        <dl class="mt-5 grid gap-4">
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.projectTypes') }}</dt>
            <dd class="flex flex-wrap gap-2">
              <span v-for="label in labelsFor(projectTypeOptions, selectedRequest.selectedProjectTypes)" :key="label" class="sazan-chip">{{ label }}</span>
            </dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.features') }}</dt>
            <dd class="flex flex-wrap gap-2">
              <span v-for="label in labelsFor(featureOptions, selectedRequest.requestedFeatures)" :key="label" class="sazan-chip">{{ label }}</span>
            </dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.businessDescription') }}</dt>
            <dd class="whitespace-pre-wrap leading-8">{{ selectedRequest.businessDescription || '—' }}</dd>
          </div>
        </dl>

        <div class="mt-5 rounded-2xl border border-border bg-background p-4">
          <label class="admin-field">
            <span>{{ t('admin.fields.status') }}</span>
            <select class="admin-input" :value="selectedRequest.status" :disabled="isUpdating" @change="onStatusChange(selectedRequest, $event)">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ requestStatusLabel(status) }}
              </option>
            </select>
          </label>
          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <button class="sazan-button-secondary" type="button" :disabled="isUpdating" @click="archiveRequest(selectedRequest)">{{ t('admin.actions.archive') }}</button>
            <button class="sazan-button-secondary text-primary" type="button" :disabled="isDeleting" @click="deleteRequest(selectedRequest)">{{ t('admin.actions.delete') }}</button>
          </div>
        </div>
      </template>

      <p v-if="successMessage" class="admin-alert admin-alert-success mt-4">{{ successMessage }}</p>
      <p v-if="errorMessage" class="admin-alert admin-alert-error mt-4">{{ errorMessage }}</p>
    </section>
  </div>
</template>
