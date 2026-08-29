<script setup lang="ts">
import type { Category } from '~~/types';

defineI18nRoute(false);
definePageMeta({ layout: 'admin' });

type CategoryForm = {
  id: string;
  title: { en: string; fa: string };
  slug: string;
  description: { en: string; fa: string };
  order: number;
  active: boolean;
};

const { t } = useI18n();
const { localize, formatDate, publishStatusLabel, publishStatusClass } = useAdminHelpers();

const { data, pending, error, refresh } = await useFetch<{ categories: Category[] }>('/api/admin/categories');
const categories = computed(() => data.value?.categories || []);
const selectedId = ref('');
const isSaving = ref(false);
const isDeleting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const blankForm = (): CategoryForm => ({
  id: '',
  title: { en: '', fa: '' },
  slug: '',
  description: { en: '', fa: '' },
  order: categories.value.length + 1,
  active: true
});

const form = reactive<CategoryForm>(blankForm());
const isEditing = computed(() => Boolean(selectedId.value));

const applyForm = (nextForm: CategoryForm) => Object.assign(form, nextForm);

const categoryToForm = (category: Category): CategoryForm => ({
  id: category.id || '',
  title: { en: category.title.en || '', fa: category.title.fa || '' },
  slug: category.slug,
  description: { en: category.description?.en || '', fa: category.description?.fa || '' },
  order: category.order || 0,
  active: category.status === 'published'
});

const formToPayload = () => ({
  id: form.id || undefined,
  title: form.title,
  slug: form.slug,
  description: form.description,
  order: Number(form.order) || 0,
  active: form.active,
  status: form.active ? 'published' : 'draft'
});

const newCategory = () => {
  selectedId.value = '';
  successMessage.value = '';
  errorMessage.value = '';
  applyForm(blankForm());
};

const editCategory = (category: Category) => {
  selectedId.value = category.id || '';
  successMessage.value = '';
  errorMessage.value = '';
  applyForm(categoryToForm(category));
};

const saveCategory = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isEditing.value) {
      await $fetch(`/api/admin/categories/${selectedId.value}`, {
        method: 'PATCH',
        body: formToPayload()
      });
    } else {
      const result = await $fetch<{ category: Category }>('/api/admin/categories', {
        method: 'POST',
        body: formToPayload()
      });
      selectedId.value = result.category.id || '';
    }

    await refresh();
    const refreshed = categories.value.find((category) => category.id === selectedId.value);
    if (refreshed) {
      applyForm(categoryToForm(refreshed));
    }
    successMessage.value = t('admin.states.saved');
  } catch {
    errorMessage.value = t('admin.states.saveError');
  } finally {
    isSaving.value = false;
  }
};

const deleteCategory = async (category: Category) => {
  if (!category.id || !confirm(t('admin.confirm.deleteCategory', { title: localize(category.title) }))) {
    return;
  }

  isDeleting.value = true;

  try {
    await $fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' });
    await refresh();
    if (selectedId.value === category.id) {
      newCategory();
    }
  } catch {
    errorMessage.value = t('admin.states.deleteError');
  } finally {
    isDeleting.value = false;
  }
};

const toggleCategory = async (category: Category) => {
  if (!category.id) {
    return;
  }

  const payload = {
    ...categoryToForm(category),
    active: category.status !== 'published'
  };

  await $fetch(`/api/admin/categories/${category.id}`, {
    method: 'PATCH',
    body: {
      id: payload.id,
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      order: payload.order,
      active: payload.active,
      status: payload.active ? 'published' : 'draft'
    }
  });
  await refresh();
};

useHead({ title: () => t('admin.nav.categories') });
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
    <section class="admin-card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-black">{{ t('admin.categories.title') }}</h2>
          <p class="mt-1 text-sm text-muted">{{ t('admin.categories.description') }}</p>
        </div>
        <button class="sazan-button-primary" type="button" @click="newCategory">{{ t('admin.actions.new') }}</button>
      </div>

      <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
      <div v-else-if="error" class="admin-empty text-primary">{{ t('admin.states.loadError') }}</div>
      <div v-else-if="!categories.length" class="admin-empty">{{ t('admin.states.empty') }}</div>
      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>{{ t('admin.fields.title') }}</th>
              <th>{{ t('admin.fields.order') }}</th>
              <th>{{ t('admin.fields.status') }}</th>
              <th>{{ t('admin.fields.updatedAt') }}</th>
              <th>{{ t('admin.fields.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" :class="selectedId === category.id ? 'bg-primary/6' : ''">
              <td>
                <button class="text-start font-black hover:text-primary" type="button" @click="editCategory(category)">{{ localize(category.title) }}</button>
                <p class="mt-1 text-xs text-muted">/{{ category.slug }}</p>
              </td>
              <td>{{ category.order || 0 }}</td>
              <td><span class="admin-badge" :class="publishStatusClass(category.status)">{{ publishStatusLabel(category.status) }}</span></td>
              <td>{{ formatDate(category.updatedAt) }}</td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <button class="admin-action" type="button" @click="editCategory(category)">{{ t('admin.actions.edit') }}</button>
                  <button class="admin-action" type="button" @click="toggleCategory(category)">{{ category.status === 'published' ? t('admin.actions.disable') : t('admin.actions.enable') }}</button>
                  <button class="admin-action text-primary" type="button" :disabled="isDeleting" @click="deleteCategory(category)">{{ t('admin.actions.delete') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-card p-5">
      <div class="mb-5 border-b border-border pb-5">
        <h2 class="text-xl font-black">{{ isEditing ? t('admin.categories.editTitle') : t('admin.categories.newTitle') }}</h2>
        <p class="mt-1 text-sm text-muted">{{ t('admin.categories.formHint') }}</p>
      </div>

      <form class="grid gap-5" @submit.prevent="saveCategory">
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
            <span>{{ t('admin.fields.order') }}</span>
            <input v-model.number="form.order" class="admin-input" type="number">
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

        <label class="inline-flex items-center gap-3 rounded-2xl border border-border bg-background p-4 text-sm font-bold">
          <input v-model="form.active" type="checkbox" class="h-4 w-4 accent-primary">
          <span>{{ t('admin.fields.enabled') }}</span>
        </label>

        <div class="flex flex-wrap justify-end gap-2">
          <button class="sazan-button-secondary" type="button" @click="newCategory">{{ t('admin.actions.cancel') }}</button>
          <button class="sazan-button-primary" type="submit" :disabled="isSaving">{{ isSaving ? t('admin.states.saving') : t('admin.actions.save') }}</button>
        </div>

        <p v-if="successMessage" class="admin-alert admin-alert-success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="admin-alert admin-alert-error">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>
