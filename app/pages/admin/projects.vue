<script setup lang="ts">
import type { Category, Project, PublishStatus, Service } from '~~/types';

defineI18nRoute(false);
definePageMeta({ layout: 'admin' });

type ProjectForm = {
  id: string;
  title: { en: string; fa: string };
  slug: string;
  shortDescription: { en: string; fa: string };
  fullDescription: { en: string; fa: string };
  categoryId: string;
  services: string[];
  technologies: string;
  coverImageUrl: string;
  coverImageKey: string;
  coverAlt: { en: string; fa: string };
  galleryRefs: string;
  videoUrl: string;
  demoUrl: string;
  projectUrl: string;
  pricing: {
    visibility: 'public' | 'private' | 'on-request';
    currency: string;
    min: string | number;
    max: string | number;
    note: { en: string; fa: string };
  };
  timeline: {
    durationWeeks: string | number;
    note: { en: string; fa: string };
  };
  year: string;
  featured: boolean;
  status: PublishStatus;
};

const { t, locale } = useI18n();
const { localize, formatDate, publishStatusLabel, publishStatusClass } = useAdminHelpers();

const { data, pending, error, refresh } = await useFetch<{
  projects: Project[];
  categories: Category[];
  services: Service[];
}>('/api/admin/projects');

const projects = computed(() => data.value?.projects || []);
const categories = computed(() => data.value?.categories || []);
const services = computed(() => data.value?.services || []);
const selectedId = ref<string>('');
const isSaving = ref(false);
const isDeleting = ref(false);
const isUploading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const createBlankForm = (): ProjectForm => ({
  id: '',
  title: { en: '', fa: '' },
  slug: '',
  shortDescription: { en: '', fa: '' },
  fullDescription: { en: '', fa: '' },
  categoryId: categories.value[0]?.id || categories.value[0]?.slug || '',
  services: [],
  technologies: '',
  coverImageUrl: '',
  coverImageKey: '',
  coverAlt: { en: '', fa: '' },
  galleryRefs: '',
  videoUrl: '',
  demoUrl: '',
  projectUrl: '',
  pricing: {
    visibility: 'on-request',
    currency: 'USD',
    min: '',
    max: '',
    note: { en: '', fa: '' }
  },
  timeline: {
    durationWeeks: '',
    note: { en: '', fa: '' }
  },
  year: String(new Date().getFullYear()),
  featured: false,
  status: 'draft'
});

const form = reactive<ProjectForm>(createBlankForm());

const splitLines = (value: string) => value
  .split(/[\n,]/)
  .map((item) => item.trim())
  .filter(Boolean);

const optionalNumber = (value: string | number) => value === '' ? undefined : Number(value);

const projectToForm = (project: Project): ProjectForm => ({
  ...createBlankForm(),
  id: project.id || '',
  title: { en: project.title.en || '', fa: project.title.fa || '' },
  slug: project.slug,
  shortDescription: { en: project.shortDescription.en || '', fa: project.shortDescription.fa || '' },
  fullDescription: { en: project.fullDescription?.en || '', fa: project.fullDescription?.fa || '' },
  categoryId: project.categoryId || '',
  services: [...(project.services || [])],
  technologies: (project.technologies || []).join('\n'),
  coverImageUrl: project.coverImage?.url || '',
  coverImageKey: project.coverImage?.key || '',
  coverAlt: { en: project.coverImage?.alt?.en || project.title.en || '', fa: project.coverImage?.alt?.fa || project.title.fa || '' },
  galleryRefs: (project.gallery || []).map((asset) => asset.url || asset.key).join('\n'),
  videoUrl: project.videoUrl || project.videos?.[0]?.url || '',
  demoUrl: project.demoUrl || '',
  projectUrl: project.projectUrl || '',
  pricing: {
    visibility: project.pricing?.visibility || 'on-request',
    currency: project.pricing?.currency || 'USD',
    min: project.pricing?.min ?? '',
    max: project.pricing?.max ?? '',
    note: { en: project.pricing?.note?.en || '', fa: project.pricing?.note?.fa || '' }
  },
  timeline: {
    durationWeeks: project.timeline?.durationWeeks ?? '',
    note: { en: project.timeline?.note?.en || '', fa: project.timeline?.note?.fa || '' }
  },
  year: project.year || '',
  featured: Boolean(project.featured),
  status: project.status || 'draft'
});

const applyForm = (nextForm: ProjectForm) => {
  Object.assign(form, nextForm);
};

const formToPayload = (source: ProjectForm) => ({
  id: source.id || undefined,
  title: source.title,
  slug: source.slug,
  shortDescription: source.shortDescription,
  fullDescription: source.fullDescription,
  categoryId: source.categoryId,
  services: source.services,
  technologies: splitLines(source.technologies),
  coverImageUrl: source.coverImageUrl,
  coverImageKey: source.coverImageKey,
  coverAlt: source.coverAlt,
  galleryRefs: splitLines(source.galleryRefs),
  videoUrl: source.videoUrl,
  demoUrl: source.demoUrl,
  projectUrl: source.projectUrl,
  pricing: {
    visibility: source.pricing.visibility,
    currency: source.pricing.currency,
    min: optionalNumber(source.pricing.min),
    max: optionalNumber(source.pricing.max),
    note: source.pricing.note
  },
  timeline: {
    durationWeeks: optionalNumber(source.timeline.durationWeeks),
    note: source.timeline.note
  },
  year: source.year,
  featured: source.featured,
  status: source.status
});

const getCategoryLabel = (categoryId?: string) => {
  const category = categories.value.find((item) => item.id === categoryId || item.slug === categoryId);
  return localize(category?.title) || categoryId || '—';
};

const isEditing = computed(() => Boolean(selectedId.value));
const previewUrl = computed(() => form.slug ? `/${locale.value}/projects/${form.slug}` : '');

const newProject = () => {
  selectedId.value = '';
  successMessage.value = '';
  errorMessage.value = '';
  applyForm(createBlankForm());
};

const editProject = (project: Project) => {
  selectedId.value = project.id || '';
  successMessage.value = '';
  errorMessage.value = '';
  applyForm(projectToForm(project));
};

const saveProject = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const payload = formToPayload(form);

    if (isEditing.value) {
      await $fetch(`/api/admin/projects/${selectedId.value}`, {
        method: 'PATCH',
        body: payload
      });
    } else {
      const result = await $fetch<{ project: Project }>('/api/admin/projects', {
        method: 'POST',
        body: payload
      });
      selectedId.value = result.project.id || '';
    }

    await refresh();
    const refreshed = projects.value.find((project) => project.id === selectedId.value);
    if (refreshed) {
      applyForm(projectToForm(refreshed));
    }
    successMessage.value = t('admin.states.saved');
  } catch (errorResponse) {
    errorMessage.value = t('admin.states.saveError');
  } finally {
    isSaving.value = false;
  }
};

const deleteProject = async (project: Project) => {
  if (!project.id || !confirm(t('admin.confirm.deleteProject', { title: localize(project.title) }))) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
    await refresh();
    if (selectedId.value === project.id) {
      newProject();
    }
  } catch {
    errorMessage.value = t('admin.states.deleteError');
  } finally {
    isDeleting.value = false;
  }
};

const patchProject = async (project: Project, patch: Partial<Project>) => {
  if (!project.id) {
    return;
  }

  const nextForm = projectToForm({ ...project, ...patch });

  await $fetch(`/api/admin/projects/${project.id}`, {
    method: 'PATCH',
    body: formToPayload(nextForm)
  });
  await refresh();
};

const handleUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  isUploading.value = true;
  errorMessage.value = '';

  try {
    const body = new FormData();
    body.append('file', file);
    const result = await $fetch<{ asset: { url?: string; key: string } }>('/api/admin/media/upload', {
      method: 'POST',
      body
    });
    form.coverImageUrl = result.asset.url || '';
    form.coverImageKey = result.asset.key;
    successMessage.value = t('admin.media.uploaded');
  } catch {
    errorMessage.value = t('admin.media.uploadError');
  } finally {
    isUploading.value = false;
    input.value = '';
  }
};

useHead({ title: () => t('admin.nav.projects') });
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
    <section class="admin-card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-black">{{ t('admin.projects.title') }}</h2>
          <p class="mt-1 text-sm text-muted">{{ t('admin.projects.description') }}</p>
        </div>
        <button class="sazan-button-primary" type="button" @click="newProject">
          {{ t('admin.actions.new') }}
        </button>
      </div>

      <div v-if="pending" class="admin-empty">{{ t('admin.states.loading') }}</div>
      <div v-else-if="error" class="admin-empty text-primary">{{ t('admin.states.loadError') }}</div>
      <div v-else-if="!projects.length" class="admin-empty">{{ t('admin.states.empty') }}</div>

      <div v-else class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>{{ t('admin.fields.title') }}</th>
              <th>{{ t('admin.fields.status') }}</th>
              <th>{{ t('admin.fields.category') }}</th>
              <th>{{ t('admin.fields.updatedAt') }}</th>
              <th>{{ t('admin.fields.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id" :class="selectedId === project.id ? 'bg-primary/6' : ''">
              <td>
                <button class="text-start font-black text-foreground hover:text-primary" type="button" @click="editProject(project)">
                  {{ localize(project.title) }}
                </button>
                <p class="mt-1 text-xs text-muted">/{{ project.slug }}</p>
              </td>
              <td>
                <span class="admin-badge" :class="publishStatusClass(project.status)">
                  {{ publishStatusLabel(project.status) }}
                </span>
              </td>
              <td>{{ getCategoryLabel(project.categoryId) }}</td>
              <td>{{ formatDate(project.updatedAt) }}</td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <button class="admin-action" type="button" @click="editProject(project)">{{ t('admin.actions.edit') }}</button>
                  <button class="admin-action" type="button" @click="patchProject(project, { status: project.status === 'published' ? 'draft' : 'published' })">
                    {{ project.status === 'published' ? t('admin.actions.unpublish') : t('admin.actions.publish') }}
                  </button>
                  <button class="admin-action" type="button" @click="patchProject(project, { featured: !project.featured })">
                    {{ project.featured ? t('admin.actions.unfeature') : t('admin.actions.feature') }}
                  </button>
                  <button class="admin-action text-primary" type="button" :disabled="isDeleting" @click="deleteProject(project)">{{ t('admin.actions.delete') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="admin-card p-5">
      <div class="mb-5 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 class="text-xl font-black">{{ isEditing ? t('admin.projects.editTitle') : t('admin.projects.newTitle') }}</h2>
          <p class="mt-1 text-sm text-muted">{{ t('admin.projects.formHint') }}</p>
        </div>
        <NuxtLink v-if="previewUrl" :to="previewUrl" class="sazan-button-secondary" target="_blank">
          {{ t('admin.actions.preview') }}
        </NuxtLink>
      </div>

      <form class="grid gap-6" @submit.prevent="saveProject">
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
            <span>{{ t('admin.fields.year') }}</span>
            <input v-model="form.year" class="admin-input">
          </label>
        </div>

        <div class="admin-form-grid">
          <label class="admin-field">
            <span>{{ t('admin.fields.shortDescriptionEn') }}</span>
            <textarea v-model="form.shortDescription.en" class="admin-textarea" required />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.shortDescriptionFa') }}</span>
            <textarea v-model="form.shortDescription.fa" class="admin-textarea" dir="rtl" required />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.fullDescriptionEn') }}</span>
            <textarea v-model="form.fullDescription.en" class="admin-textarea" />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.fullDescriptionFa') }}</span>
            <textarea v-model="form.fullDescription.fa" class="admin-textarea" dir="rtl" />
          </label>
        </div>

        <div class="admin-form-grid">
          <label class="admin-field">
            <span>{{ t('admin.fields.category') }}</span>
            <select v-model="form.categoryId" class="admin-input">
              <option value="">{{ t('admin.states.notSpecified') }}</option>
              <option v-for="category in categories" :key="category.id" :value="category.id || category.slug">
                {{ localize(category.title) }}
              </option>
            </select>
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.status') }}</span>
            <select v-model="form.status" class="admin-input">
              <option v-for="status in ['draft', 'review', 'published', 'archived']" :key="status" :value="status">
                {{ publishStatusLabel(status) }}
              </option>
            </select>
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.technologies') }}</span>
            <textarea v-model="form.technologies" class="admin-textarea" :placeholder="t('admin.placeholders.onePerLine')" />
          </label>
          <label class="admin-field">
            <span>{{ t('admin.fields.services') }}</span>
            <select v-model="form.services" class="admin-input min-h-32" multiple>
              <option v-for="service in services" :key="service.id" :value="service.id || service.slug">
                {{ localize(service.title) }}
              </option>
            </select>
          </label>
        </div>

        <div class="admin-section-box">
          <h3>{{ t('admin.projects.media') }}</h3>
          <div class="admin-form-grid mt-4">
            <label class="admin-field">
              <span>{{ t('admin.fields.coverImageUrl') }}</span>
              <input v-model="form.coverImageUrl" class="admin-input" placeholder="/uploads/admin/...">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.coverImageKey') }}</span>
              <input v-model="form.coverImageKey" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.coverAltEn') }}</span>
              <input v-model="form.coverAlt.en" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.coverAltFa') }}</span>
              <input v-model="form.coverAlt.fa" class="admin-input" dir="rtl">
            </label>
            <label class="admin-field md:col-span-2">
              <span>{{ t('admin.fields.galleryRefs') }}</span>
              <textarea v-model="form.galleryRefs" class="admin-textarea" :placeholder="t('admin.placeholders.oneMediaPerLine')" />
            </label>
            <label class="admin-field md:col-span-2">
              <span>{{ t('admin.media.uploadCover') }}</span>
              <input class="admin-input" type="file" accept="image/*,video/mp4,video/webm,application/pdf" :disabled="isUploading" @change="handleUpload">
            </label>
          </div>
        </div>

        <div class="admin-section-box">
          <h3>{{ t('admin.projects.linksPricingTimeline') }}</h3>
          <div class="admin-form-grid mt-4">
            <label class="admin-field">
              <span>{{ t('admin.fields.videoUrl') }}</span>
              <input v-model="form.videoUrl" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.demoUrl') }}</span>
              <input v-model="form.demoUrl" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.projectUrl') }}</span>
              <input v-model="form.projectUrl" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.pricingVisibility') }}</span>
              <select v-model="form.pricing.visibility" class="admin-input">
                <option value="public">{{ t('admin.pricing.public') }}</option>
                <option value="private">{{ t('admin.pricing.private') }}</option>
                <option value="on-request">{{ t('admin.pricing.onRequest') }}</option>
              </select>
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.currency') }}</span>
              <input v-model="form.pricing.currency" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.priceMin') }}</span>
              <input v-model="form.pricing.min" class="admin-input" type="number" min="0">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.priceMax') }}</span>
              <input v-model="form.pricing.max" class="admin-input" type="number" min="0">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.durationWeeks') }}</span>
              <input v-model="form.timeline.durationWeeks" class="admin-input" type="number" min="0">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.pricingNoteEn') }}</span>
              <input v-model="form.pricing.note.en" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.pricingNoteFa') }}</span>
              <input v-model="form.pricing.note.fa" class="admin-input" dir="rtl">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.timelineNoteEn') }}</span>
              <input v-model="form.timeline.note.en" class="admin-input">
            </label>
            <label class="admin-field">
              <span>{{ t('admin.fields.timelineNoteFa') }}</span>
              <input v-model="form.timeline.note.fa" class="admin-input" dir="rtl">
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
          <label class="inline-flex items-center gap-3 text-sm font-bold">
            <input v-model="form.featured" type="checkbox" class="h-4 w-4 accent-primary">
            <span>{{ t('admin.fields.featured') }}</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <button class="sazan-button-secondary" type="button" @click="newProject">{{ t('admin.actions.cancel') }}</button>
            <button class="sazan-button-primary" type="submit" :disabled="isSaving">
              {{ isSaving ? t('admin.states.saving') : t('admin.actions.save') }}
            </button>
          </div>
        </div>

        <p v-if="successMessage" class="admin-alert admin-alert-success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="admin-alert admin-alert-error">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>
