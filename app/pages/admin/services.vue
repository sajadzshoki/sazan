<script setup lang="ts">
import type { Service } from '~~/types';

defineI18nRoute(false);
definePageMeta({ layout: 'admin' });

type ServiceForm = {
  id: string;
  title: { en: string; fa: string };
  slug: string;
  shortDescription: { en: string; fa: string };
  description: { en: string; fa: string };
  icon: string;
  order: number;
  featured: boolean;
  active: boolean;
};

const { t } = useI18n();
const { localize, formatDate, publishStatusLabel, publishStatusClass } = useAdminHelpers();

const { data, pending, error, refresh } = await useFetch<{ services: Service[] }>('/api/admin/services');
const services = computed(() => data.value?.services || []);
const selectedId = ref('');
const isSaving = ref(false);
const isDeleting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const blankForm = (): ServiceForm => ({
  id: '',
  title: { en: '', fa: '' },
  slug: '',
  shortDescription: { en: '', fa: '' },
  description: { en: '', fa: '' },
  icon: '',
  order: services.value.length + 1,
  featured: false,
  active: true
});

const form = reactive<ServiceForm>(blankForm());
const isEditing = computed(() => Boolean(selectedId.value));
const applyForm = (nextForm: ServiceForm) => Object.assign(form, nextForm);

const serviceToForm = (service: Service): ServiceForm => ({
  id: service.id || '',
  title: { en: service.title.en || '', fa: service.title.fa || '' },
  slug: service.slug,
  shortDescription: { en: service.shortDescription.en || '', fa: service.shortDescription.fa || '' },
  description: { en: service.description?.en || '', fa: service.description?.fa || '' },
  icon: service.icon || '',
  order: service.order || 0,
  featured: Boolean(service.featured),
  active: service.active !== false && service.status === 'published'
});

const formToPayload = (source = form) => ({
  id: source.id || undefined,
  title: source.title,
  slug: source.slug,
  shortDescription: source.shortDescription,
  description: source.description,
  icon: source.icon,
  order: Number(source.order) || 0,
  featured: source.featured,
  active: source.active,
  status: source.active ? 'published' : 'draft'
});

const newService = () => {
  selectedId.value = '';
  successMessage.value = '';
  errorMessage.value = '';
  applyForm(blankForm());
};

const editService = (service: Service) => {
  selectedId.value = service.id || '';
  successMessage.value = '';
  errorMessage.value = '';
  applyForm(serviceToForm(service));
};

const saveService = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isEditing.value) {
      await $fetch(`/api/admin/services/${selectedId.value}`, { method: 'PATCH', body: formToPayload() });
    } else {
      const result = await $fetch<{ service: Service }>('/api/admin/services', { method: 'POST', body: formToPayload() });
      selectedId.value = result.service.id || '';
    }

    await refresh();
    const refreshed = services.value.find((service) => service.id === selectedId.value);
    if (refreshed) {
      applyForm(serviceToForm(refreshed));
    }
    successMessage.value = t('admin.states.saved');
  } catch {
    errorMessage.value = t('admin.states.saveError');
  } finally {
    isSaving.value = false;
  }
};

const deleteService = async (service: Service) => {
  if (!service.id || !confirm(t('admin.confirm.deleteService', { title: localize(service.title) }))) {
    return;
  }

  isDeleting.value = true;

  try {
    await $fetch(`/api/admin/services/${service.id}`, { method: 'DELETE' });
    await refresh();
    if (selectedId.value === service.id) {
      newService();
    }
  } catch {
    errorMessage.value = t('admin.states.deleteError');
  } finally {
    isDeleting.value = false;
  }
};

const patchService = async (service: Service, patch: Partial<ServiceForm>) => {
  if (!service.id) {
    return;
  }

  const nextForm = { ...serviceToForm(service), ...patch };
  await $fetch(`/api/admin/services/${service.id}`, { method: 'PATCH', body: formToPayload(nextForm) });
  await refresh();
};

useHead({ title: () => t('admin.nav.services') });
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
    <section class="admin-card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-black">{{ t('admin.services.title') }}</h2>
          <p class="mt-1 text-sm text-muted">{{ t('admin.services.description') }}</p>
        </div>
        <button class="sazan-button-primary" type="button" @click="newService">{{ t('admin.actions.new') }}</button>
      </div>

      <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
      <div v-else-if="error" class="admin-empty text-primary">{{ t('admin.states.loadError') }}</div>
      <div v-else-if="!services.length" class="admin-empty">{{ t('admin.states.empty') }}</div>
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>{{ t('admin.fields.title') }}</th>
              <th>{{ t('admin.fields.icon') }}</th>
              <th>{{ t('admin.fields.order') }}</th>
              <th>{{ t('admin.fields.status') }}</th>
              <th>{{ t('admin.fields.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id" :class="selectedId === service.id ? 'bg-primary/6' : ''">
              <td>
                <button class="text-start font-black hover:text-primary" type="button" @click="editService(service)">{{ localize(service.title) }}</button>
                <p class="mt-1 text-xs text-muted">/{{ service.slug }}</p>
              </td>
              <td>{{ service.icon || '—' }}</td>
              <td>{{ service.order || 0 }}</td>
              <td><span class="admin-badge" :class="publishStatusClass(service.status)">{{ publishStatusLabel(service.status) }}</span></td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <button class="admin-action" type="button" @click="editService(service)">{{ t('admin.actions.edit') }}</button>
                  <button class="admin-action" type="button" @click="patchService(service, { active: !(service.active !== false && service.status === 'published') })">
                    {{ service.active !== false && service.status === 'published' ? t('admin.actions.disable') : t('admin.actions.enable') }}
                  </button>
                  <button class="admin-action" type="button" @click="patchService(service, { featured: !service.featured })">
                    {{ service.featured ? t('admin.actions.unfeature') : t('admin.actions.feature') }}
                  </button>
                  <button class="admin-action text-primary" type="button" :disabled="isDeleting" @click="deleteService(service)">{{ t('admin.actions.delete') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-card p-5">
      <div class="mb-5 border-b border-border pb-5">
        <h2 class="text-xl font-black">{{ isEditing ? t('admin.services.editTitle') : t('admin.services.newTitle') }}</h2>
        <p class="mt-1 text-sm text-muted">{{ t('admin.services.formHint') }}</p>
      </div>

      <form class="grid gap-5" @submit.prevent="saveService">
        <div class="admin-form-grid">
          <label class="admin-field">
            <span>{{ t('admin.fields.titleEn') }}</span>
            <input v-model="form.title.en" class="admin-input" required>
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.titleFa') }}</span>
            <input v-model="form.title.fa" class="admin-input" dir="rtl" required>
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.slug') }}</span>
            <input v-model="form.slug" class="admin-input" required>
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.icon') }}</span>
            <input v-model="form.icon" class="admin-input" placeholder="dashboard">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.order') }}</span>
            <input v-model.number="form.order" class="admin-input" type="number">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.shortDescriptionEn') }}</span>
            <textarea v-model="form.shortDescription.en" class="admin-textarea" required />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.shortDescriptionFa') }}</span>
            <textarea v-model="form.shortDescription.fa" class="admin-textarea" dir="rtl" required />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.descriptionEn') }}</span>
            <textarea v-model="form.description.en" class="admin-textarea" />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.descriptionFa') }}</span>
            <textarea v-model="form.description.fa" class="admin-textarea" dir="rtl" />
          </label>
        </div>

        <div class="grid gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-2">
          <label class="inline-flex items-center gap-3 text-sm font-bold">
            <input v-model="form.active" type="checkbox" class="h-4 w-4 accent-primary">
            <span>{{ t('admin.fields.active') }}</span>
          </label>
          <label class="inline-flex items-center gap-3 text-sm font-bold">
            <input v-model="form.featured" type="checkbox" class="h-4 w-4 accent-primary">
            <span>{{ t('admin.fields.featured') }}</span>
          </label>
        </div>

        <div class="flex flex-wrap justify-end gap-2">
          <button class="sazan-button-secondary" type="button" @click="newService">{{ t('admin.actions.cancel') }}</button>
          <button class="sazan-button-primary" type="submit" :disabled="isSaving">{{ isSaving ? t('admin.states.saving') : t('admin.actions.save') }}</button>
        </div>

        <p v-if="successMessage" class="admin-alert admin-alert-success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="admin-alert admin-alert-error">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>
