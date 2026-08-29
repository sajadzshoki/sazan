<script setup lang="ts">
import type { PublicContactSettings, SiteSettings } from '~~/types';

defineI18nRoute(false);
definePageMeta({ layout: 'admin' });

type SettingsForm = PublicContactSettings;

const { t } = useI18n();
const { formatDate } = useAdminHelpers();

const { data, pending, error, refresh } = await useFetch<{ settings: SiteSettings }>('/api/admin/settings');
const { data: mediaStatus } = await useFetch('/api/admin/media/status');

const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const blankForm = (): SettingsForm => ({
  email: '',
  phone: '',
  whatsapp: '',
  telegram: '',
  social: {
    linkedin: '',
    behance: '',
    dribbble: ''
  }
});

const form = reactive<SettingsForm>(blankForm());

watch(data, (value) => {
  if (!value?.settings?.contact) {
    return;
  }

  Object.assign(form, {
    email: value.settings.contact.email || '',
    phone: value.settings.contact.phone || '',
    whatsapp: value.settings.contact.whatsapp || '',
    telegram: value.settings.contact.telegram || '',
    social: {
      linkedin: value.settings.contact.social?.linkedin || '',
      behance: value.settings.contact.social?.behance || '',
      dribbble: value.settings.contact.social?.dribbble || ''
    }
  });
}, { immediate: true });

const saveSettings = async () => {
  isSaving.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: form
    });
    await refresh();
    successMessage.value = t('admin.states.saved');
  } catch {
    errorMessage.value = t('admin.states.saveError');
  } finally {
    isSaving.value = false;
  }
};

useHead({ title: () => t('admin.nav.settings') });
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
    <section class="admin-card p-5">
      <div class="mb-5 border-b border-border pb-5">
        <h2 class="text-xl font-black">{{ t('admin.settings.title') }}</h2>
        <p class="mt-1 text-sm text-muted">{{ t('admin.settings.description') }}</p>
      </div>

      <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
      <div v-else-if="error" class="admin-empty text-primary">{{ t('admin.states.loadError') }}</div>

      <form v-else class="grid gap-5" @submit.prevent="saveSettings">
        <div class="admin-form-grid">
          <label class="admin-field">
            <span>{{ t('admin.fields.email') }}</span>
            <input v-model="form.email" class="admin-input" type="email" required>
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.phone') }}</span>
            <input v-model="form.phone" class="admin-input">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.whatsapp') }}</span>
            <input v-model="form.whatsapp" class="admin-input">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.telegram') }}</span>
            <input v-model="form.telegram" class="admin-input">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.linkedin') }}</span>
            <input v-model="form.social.linkedin" class="admin-input">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.behance') }}</span>
            <input v-model="form.social.behance" class="admin-input">
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.dribbble') }}</span>
            <input v-model="form.social.dribbble" class="admin-input">
          </label>
        </div>

        <div class="flex flex-wrap justify-end gap-2">
          <button class="sazan-button-secondary" type="button" @click="refresh()">{{ t('admin.actions.reset') }}</button>
          <button class="sazan-button-primary" type="submit" :disabled="isSaving">{{ isSaving ? t('admin.states.saving') : t('admin.actions.save') }}</button>
        </div>

        <p v-if="successMessage" class="admin-alert admin-alert-success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="admin-alert admin-alert-error">{{ errorMessage }}</p>
      </form>
    </section>

    <aside class="grid gap-6 content-start">
      <section class="admin-card p-5">
        <h2 class="text-xl font-black">{{ t('admin.settings.publicPreview') }}</h2>
        <dl class="mt-4 grid gap-3 text-sm">
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.email') }}</dt>
            <dd>{{ form.email || '—' }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.phone') }}</dt>
            <dd>{{ form.phone || '—' }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.social') }}</dt>
            <dd class="break-words">{{ [form.social.linkedin, form.social.behance, form.social.dribbble].filter(Boolean).join(' · ') || '—' }}</dd>
          </div>
        </dl>
      </section>

      <section class="admin-card p-5">
        <h2 class="text-xl font-black">{{ t('admin.settings.storage') }}</h2>
        <dl class="mt-4 grid gap-3 text-sm">
          <div class="admin-detail-box">
            <dt>{{ t('admin.dashboard.mediaProvider') }}</dt>
            <dd>{{ mediaStatus?.provider || '—' }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.dashboard.minio') }}</dt>
            <dd>{{ mediaStatus?.minio?.configured ? t('admin.states.configured') : t('admin.states.notConfigured') }}</dd>
          </div>
          <div class="admin-detail-box">
            <dt>{{ t('admin.fields.updatedAt') }}</dt>
            <dd>{{ formatDate(data?.settings.updatedAt) }}</dd>
          </div>
        </dl>
        <p class="mt-4 text-sm leading-7 text-muted">{{ t('admin.settings.storageNote') }}</p>
      </section>
    </aside>
  </div>
</template>
