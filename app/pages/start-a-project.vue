<script setup lang="ts">
import {
  budgetOptions,
  featureOptions,
  preferredContactOptions,
  projectTypeOptions,
  timelineOptions,
  type LeadOption
} from '~/data/lead';
import type {
  PreferredContactMethod,
  ProjectRequestBudgetRange,
  ProjectRequestFeature,
  ProjectRequestProjectType,
  ProjectRequestTimeline
} from '~~/types';

type StepKey = 'projectTypes' | 'idea' | 'features' | 'budget' | 'timeline' | 'contact' | 'review';
type ContactErrorKey = 'fullName' | 'email';

type ReviewItem = {
  step: StepKey;
  label: string;
  value: string;
};

type ServerIssue = {
  field: string;
  code: string;
};

const stepKeys: readonly StepKey[] = ['projectTypes', 'idea', 'features', 'budget', 'timeline', 'contact', 'review'];
const optionalSteps: readonly StepKey[] = ['projectTypes', 'idea', 'features', 'budget', 'timeline'];

const localePath = useLocalePath();
const { t, locale } = useI18n();
const { formatDigits } = useLocaleDigits();
const { direction } = useAppDirection();

const currentStepIndex = ref(0);
const maxVisitedStepIndex = ref(0);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const submitError = ref('');
const responseReference = ref('');
const contactErrors = ref<Partial<Record<ContactErrorKey, string>>>({});

const form = reactive({
  selectedProjectTypes: [] as ProjectRequestProjectType[],
  businessDescription: '',
  requestedFeatures: [] as ProjectRequestFeature[],
  budgetRange: undefined as ProjectRequestBudgetRange | undefined,
  timeline: undefined as ProjectRequestTimeline | undefined,
  contact: {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    preferredContactMethod: undefined as PreferredContactMethod | undefined
  }
});

const currentStepKey = computed<StepKey>(() => stepKeys[currentStepIndex.value] || 'projectTypes');
const isReviewStep = computed(() => currentStepKey.value === 'review');
const isContactStep = computed(() => currentStepKey.value === 'contact');
const isOptionalStep = computed(() => optionalSteps.includes(currentStepKey.value));
const progressPercent = computed(() => `${Math.round(((currentStepIndex.value + 1) / stepKeys.length) * 100)}%`);
const progressText = computed(() => t('startProject.progress.stepOf', {
  current: formatDigits(currentStepIndex.value + 1),
  total: formatDigits(stepKeys.length)
}));
const nextSymbol = computed(() => (direction.value === 'rtl' ? '←' : '→'));
const backSymbol = computed(() => (direction.value === 'rtl' ? '→' : '←'));

const stepMeta = computed(() => stepKeys.map((step, index) => ({
  key: step,
  index,
  number: formatDigits(String(index + 1).padStart(2, '0')),
  title: t(`startProject.steps.${step}.shortTitle`),
  isReachable: index <= maxVisitedStepIndex.value,
  isCurrent: index === currentStepIndex.value
})));

const contactMethodLabel = computed(() => {
  if (!form.contact.preferredContactMethod) {
    return '';
  }

  const option = preferredContactOptions.find((item) => item.value === form.contact.preferredContactMethod);

  return option ? t(option.labelKey) : '';
});

const selectedProjectTypeLabels = computed(() => getSelectedLabels(form.selectedProjectTypes, projectTypeOptions));
const requestedFeatureLabels = computed(() => getSelectedLabels(form.requestedFeatures, featureOptions));
const selectedBudgetLabel = computed(() => getSingleLabel(form.budgetRange, budgetOptions));
const selectedTimelineLabel = computed(() => getSingleLabel(form.timeline, timelineOptions));

const acknowledgement = computed(() => {
  if (currentStepKey.value === 'idea' && selectedProjectTypeLabels.value) {
    return t('startProject.acknowledgements.projectTypes', { value: selectedProjectTypeLabels.value });
  }

  if (currentStepKey.value === 'features' && form.businessDescription.trim()) {
    return t('startProject.acknowledgements.idea');
  }

  if (currentStepKey.value === 'budget' && requestedFeatureLabels.value) {
    return t('startProject.acknowledgements.features', { value: requestedFeatureLabels.value });
  }

  if (currentStepKey.value === 'timeline' && selectedBudgetLabel.value) {
    return t('startProject.acknowledgements.budget', { value: selectedBudgetLabel.value });
  }

  if (currentStepKey.value === 'contact') {
    return t('startProject.acknowledgements.contact');
  }

  if (currentStepKey.value === 'review') {
    return t('startProject.acknowledgements.review');
  }

  return t('startProject.acknowledgements.default');
});

const reviewItems = computed<ReviewItem[]>(() => {
  const items: ReviewItem[] = [];

  if (selectedProjectTypeLabels.value) {
    items.push({
      step: 'projectTypes',
      label: t('startProject.review.labels.projectTypes'),
      value: selectedProjectTypeLabels.value
    });
  }

  if (form.businessDescription.trim()) {
    items.push({
      step: 'idea',
      label: t('startProject.review.labels.idea'),
      value: form.businessDescription.trim()
    });
  }

  if (requestedFeatureLabels.value) {
    items.push({
      step: 'features',
      label: t('startProject.review.labels.features'),
      value: requestedFeatureLabels.value
    });
  }

  if (selectedBudgetLabel.value) {
    items.push({
      step: 'budget',
      label: t('startProject.review.labels.budget'),
      value: selectedBudgetLabel.value
    });
  }

  if (selectedTimelineLabel.value) {
    items.push({
      step: 'timeline',
      label: t('startProject.review.labels.timeline'),
      value: selectedTimelineLabel.value
    });
  }

  return items;
});

const contactReviewItems = computed(() => [
  { label: t('startProject.fields.fullName'), value: form.contact.fullName.trim() },
  { label: t('startProject.fields.email'), value: form.contact.email.trim() },
  { label: t('startProject.fields.phone'), value: form.contact.phone.trim() },
  { label: t('startProject.fields.company'), value: form.contact.company.trim() },
  { label: t('startProject.fields.preferredContactMethod'), value: contactMethodLabel.value }
].filter((item) => item.value));

function getSelectedLabels<T extends string>(values: readonly T[], options: readonly LeadOption<T>[]) {
  return values
    .map((value) => getSingleLabel(value, options))
    .filter(Boolean)
    .join(t('startProject.review.separator'));
}

function getSingleLabel<T extends string>(value: T | undefined, options: readonly LeadOption<T>[]) {
  if (!value) {
    return '';
  }

  const option = options.find((item) => item.value === value);

  return option ? t(option.labelKey) : '';
}

function getChoiceClass(isSelected: boolean) {
  return isSelected
    ? 'border-primary bg-surface text-foreground shadow-[var(--shadow-soft)]'
    : 'border-border bg-background/58 text-foreground hover:border-primary/45 hover:bg-surface/82';
}

function toggleExclusiveSelection<T extends string>(items: T[], value: T, exclusiveValue: T) {
  if (value === exclusiveValue) {
    items.splice(0, items.length, value);
    return;
  }

  const exclusiveIndex = items.indexOf(exclusiveValue);
  if (exclusiveIndex >= 0) {
    items.splice(exclusiveIndex, 1);
  }

  const existingIndex = items.indexOf(value);
  if (existingIndex >= 0) {
    items.splice(existingIndex, 1);
    return;
  }

  items.push(value);
}

function toggleProjectType(value: ProjectRequestProjectType) {
  toggleExclusiveSelection(form.selectedProjectTypes, value, 'notSure');
}

function toggleFeature(value: ProjectRequestFeature) {
  toggleExclusiveSelection(form.requestedFeatures, value, 'notSure');
}

function selectBudget(value: ProjectRequestBudgetRange) {
  form.budgetRange = form.budgetRange === value ? undefined : value;
}

function selectTimeline(value: ProjectRequestTimeline) {
  form.timeline = form.timeline === value ? undefined : value;
}

function selectContactMethod(value: PreferredContactMethod) {
  form.contact.preferredContactMethod = form.contact.preferredContactMethod === value ? undefined : value;
}

function goToStep(index: number) {
  if (index <= maxVisitedStepIndex.value) {
    currentStepIndex.value = index;
    submitError.value = '';
  }
}

function goBack() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value -= 1;
    submitError.value = '';
  }
}

function goNext() {
  submitError.value = '';

  if (isContactStep.value && !validateContact()) {
    return;
  }

  if (currentStepIndex.value < stepKeys.length - 1) {
    currentStepIndex.value += 1;
    maxVisitedStepIndex.value = Math.max(maxVisitedStepIndex.value, currentStepIndex.value);
  }
}

function editStep(step: StepKey) {
  const index = stepKeys.indexOf(step);

  if (index >= 0) {
    currentStepIndex.value = index;
    maxVisitedStepIndex.value = Math.max(maxVisitedStepIndex.value, index);
    submitError.value = '';
  }
}

function clearContactError(field: ContactErrorKey) {
  if (contactErrors.value[field]) {
    contactErrors.value = {
      ...contactErrors.value,
      [field]: undefined
    };
  }
}

function validateContact() {
  const errors: Partial<Record<ContactErrorKey, string>> = {};
  const fullName = form.contact.fullName.trim();
  const email = form.contact.email.trim();

  if (!fullName) {
    errors.fullName = t('startProject.validation.fullNameRequired');
  }

  if (!email) {
    errors.email = t('startProject.validation.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t('startProject.validation.emailInvalid');
  }

  contactErrors.value = errors;

  return Object.keys(errors).length === 0;
}

function applyServerIssues(issues: ServerIssue[]) {
  const errors: Partial<Record<ContactErrorKey, string>> = {};

  for (const issue of issues) {
    if (issue.field === 'contact.fullName') {
      errors.fullName = t('startProject.validation.fullNameRequired');
    }

    if (issue.field === 'contact.email') {
      errors.email = issue.code === 'invalidEmail'
        ? t('startProject.validation.emailInvalid')
        : t('startProject.validation.emailRequired');
    }
  }

  if (Object.keys(errors).length > 0) {
    contactErrors.value = errors;
    editStep('contact');
    return true;
  }

  return false;
}

async function submitRequest() {
  if (isSubmitting.value || isSuccess.value) {
    return;
  }

  submitError.value = '';

  if (!validateContact()) {
    editStep('contact');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch<{ ok: boolean; reference: string }>('/api/project-requests', {
      method: 'POST',
      body: {
        selectedProjectTypes: form.selectedProjectTypes,
        businessDescription: form.businessDescription.trim() || undefined,
        requestedFeatures: form.requestedFeatures,
        budgetRange: form.budgetRange,
        timeline: form.timeline,
        contact: {
          fullName: form.contact.fullName.trim(),
          email: form.contact.email.trim(),
          phone: form.contact.phone.trim() || undefined,
          company: form.contact.company.trim() || undefined,
          preferredContactMethod: form.contact.preferredContactMethod
        },
        preferredLocale: locale.value === 'en' ? 'en' : 'fa'
      }
    });

    responseReference.value = response.reference;
    isSuccess.value = true;
  } catch (error) {
    const responseError = error as { data?: { data?: { issues?: ServerIssue[] } } };
    const issues = responseError.data?.data?.issues || [];

    if (issues.length > 0) {
      const hasContactIssues = applyServerIssues(issues);
      submitError.value = hasContactIssues
        ? t('startProject.validation.fixFields')
        : t('startProject.validation.invalidRequest');
    } else {
      submitError.value = t('startProject.validation.serverError');
    }
  } finally {
    isSubmitting.value = false;
  }
}

function handlePrimaryAction() {
  if (isReviewStep.value) {
    void submitRequest();
    return;
  }

  goNext();
}

usePublicSeo({
  title: () => t('startProject.seo.title'),
  description: () => t('startProject.seo.description'),
  structuredData: () => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('startProject.seo.title'),
    description: t('startProject.seo.description')
  })
});
</script>

<template>
  <div>
    <section v-if="isSuccess" class="sazan-section-tight">
      <BaseContainer>
        <div class="mx-auto max-w-4xl border border-border bg-surface p-6 text-center shadow-[var(--shadow-soft)] sm:p-10 lg:p-14">
          <p class="sazan-eyebrow justify-center">
            {{ t('startProject.success.eyebrow') }}
          </p>
          <h1 class="sazan-heading-xl mt-7 text-balance text-foreground">
            {{ t('startProject.success.title') }}
          </h1>
          <p class="sazan-body-lg mx-auto mt-6 max-w-2xl text-pretty">
            {{ t('startProject.success.lead') }}
          </p>
          <p class="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted">
            {{ t('startProject.success.contactNote') }}
          </p>
          <p class="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            {{ t('startProject.success.reference', { reference: responseReference.slice(0, 8) }) }}
          </p>

          <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <NuxtLink :to="localePath('/')" class="sazan-button-primary">
              {{ t('common.returnHome') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/projects')" class="sazan-button-secondary">
              {{ t('common.exploreProjects') }}
            </NuxtLink>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section v-else class="sazan-section-tight">
      <BaseContainer>
        <div class="grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-12">
          <aside class="lg:sticky lg:top-28 lg:self-start">
            <p class="sazan-eyebrow motion-fade-up">
              {{ t('startProject.hero.eyebrow') }}
            </p>
            <h1 class="sazan-heading-xl motion-fade-up motion-delay-1 mt-7 max-w-4xl text-balance text-foreground">
              {{ t('startProject.hero.title') }}
            </h1>
            <p class="sazan-body-lg motion-fade-up motion-delay-2 mt-6 max-w-xl text-pretty">
              {{ t('startProject.hero.lead') }}
            </p>

            <div class="mt-8 border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
              <div class="flex items-center justify-between gap-4">
                <p class="sazan-meta text-foreground">
                  {{ progressText }}
                </p>
                <p class="text-xs font-bold text-muted">
                  {{ t('startProject.progress.optionalReminder') }}
                </p>
              </div>
              <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-border/70" aria-hidden="true">
                <div class="h-full rounded-full bg-primary transition-all duration-300" :style="{ width: progressPercent }" />
              </div>

              <ol class="mt-6 grid gap-2">
                <li v-for="step in stepMeta" :key="step.key">
                  <button
                    type="button"
                    class="sazan-focus flex w-full items-center justify-between gap-4 border px-3 py-3 text-start transition"
                    :class="step.isCurrent
                      ? 'border-primary bg-background text-foreground'
                      : step.isReachable
                        ? 'border-border text-muted hover:bg-background/72 hover:text-foreground'
                        : 'border-transparent text-muted/55'"
                    :disabled="!step.isReachable"
                    :aria-current="step.isCurrent ? 'step' : undefined"
                    @click="goToStep(step.index)"
                  >
                    <span class="flex items-center gap-3">
                      <span class="service-index text-sm">{{ step.number }}</span>
                      <span class="text-sm font-bold">{{ step.title }}</span>
                    </span>
                    <span v-if="step.index < currentStepIndex" class="text-primary" aria-hidden="true">✓</span>
                  </button>
                </li>
              </ol>
            </div>

            <div class="mt-5 border border-border bg-background/70 p-5">
              <p class="sazan-meta text-primary">
                {{ t('startProject.guidance.eyebrow') }}
              </p>
              <p class="mt-3 text-sm leading-7 text-muted">
                {{ acknowledgement }}
              </p>
            </div>
          </aside>

          <form class="sazan-surface overflow-hidden shadow-[var(--shadow-soft)]" novalidate @submit.prevent="handlePrimaryAction">
            <Transition name="lead-step" mode="out-in">
              <div :key="currentStepKey" class="p-5 sm:p-7 lg:p-9">
                <div class="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p class="sazan-meta text-primary">
                      {{ t(`startProject.steps.${currentStepKey}.eyebrow`) }}
                    </p>
                    <h2 class="sazan-heading-lg mt-4 max-w-3xl text-balance text-foreground">
                      {{ t(`startProject.steps.${currentStepKey}.title`) }}
                    </h2>
                    <p class="mt-4 max-w-2xl text-base leading-7 text-muted">
                      {{ t(`startProject.steps.${currentStepKey}.lead`) }}
                    </p>
                  </div>

                  <span
                    v-if="isOptionalStep"
                    class="w-max rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted"
                  >
                    {{ t('common.optional') }}
                  </span>
                  <span v-else-if="isContactStep" class="w-max rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {{ t('common.required') }}
                  </span>
                </div>

                <div v-if="currentStepKey === 'projectTypes'" class="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="option in projectTypeOptions"
                    :key="option.value"
                    type="button"
                    class="sazan-focus min-h-28 border p-4 text-start transition"
                    :class="getChoiceClass(form.selectedProjectTypes.includes(option.value))"
                    :aria-pressed="form.selectedProjectTypes.includes(option.value)"
                    @click="toggleProjectType(option.value)"
                  >
                    <span class="flex items-start justify-between gap-4">
                      <span class="text-lg font-black leading-6">{{ t(option.labelKey) }}</span>
                      <span class="text-primary" aria-hidden="true">{{ form.selectedProjectTypes.includes(option.value) ? '✓' : '+' }}</span>
                    </span>
                    <span class="mt-3 block text-sm leading-6 text-muted">{{ t(option.descriptionKey) }}</span>
                  </button>
                </div>

                <div v-else-if="currentStepKey === 'idea'" class="mt-7">
                  <label for="business-description" class="sazan-meta text-foreground">
                    {{ t('startProject.fields.businessDescription') }}
                  </label>
                  <textarea
                    id="business-description"
                    v-model="form.businessDescription"
                    rows="9"
                    maxlength="3000"
                    class="sazan-focus mt-4 min-h-64 w-full resize-y border border-border bg-background p-4 text-base leading-8 text-foreground placeholder:text-muted/70"
                    :placeholder="t('startProject.placeholders.businessDescription')"
                  />
                  <div class="mt-3 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>{{ t('startProject.examples.idea') }}</p>
                    <p>{{ formatDigits(form.businessDescription.length) }} / {{ formatDigits(3000) }}</p>
                  </div>
                </div>

                <div v-else-if="currentStepKey === 'features'" class="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="option in featureOptions"
                    :key="option.value"
                    type="button"
                    class="sazan-focus min-h-24 border p-4 text-start transition"
                    :class="getChoiceClass(form.requestedFeatures.includes(option.value))"
                    :aria-pressed="form.requestedFeatures.includes(option.value)"
                    @click="toggleFeature(option.value)"
                  >
                    <span class="flex items-start justify-between gap-4">
                      <span class="text-lg font-black leading-6">{{ t(option.labelKey) }}</span>
                      <span class="text-primary" aria-hidden="true">{{ form.requestedFeatures.includes(option.value) ? '✓' : '+' }}</span>
                    </span>
                    <span class="mt-3 block text-sm leading-6 text-muted">{{ t(option.descriptionKey) }}</span>
                  </button>
                </div>

                <div v-else-if="currentStepKey === 'budget'" class="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="option in budgetOptions"
                    :key="option.value"
                    type="button"
                    class="sazan-focus border p-4 text-start transition"
                    :class="getChoiceClass(form.budgetRange === option.value)"
                    :aria-pressed="form.budgetRange === option.value"
                    @click="selectBudget(option.value)"
                  >
                    <span class="flex items-start justify-between gap-4">
                      <span class="text-lg font-black leading-6">{{ t(option.labelKey) }}</span>
                      <span class="text-primary" aria-hidden="true">{{ form.budgetRange === option.value ? '✓' : '+' }}</span>
                    </span>
                    <span class="mt-3 block text-sm leading-6 text-muted">{{ t(option.descriptionKey) }}</span>
                  </button>
                </div>

                <div v-else-if="currentStepKey === 'timeline'" class="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    v-for="option in timelineOptions"
                    :key="option.value"
                    type="button"
                    class="sazan-focus border p-4 text-start transition"
                    :class="getChoiceClass(form.timeline === option.value)"
                    :aria-pressed="form.timeline === option.value"
                    @click="selectTimeline(option.value)"
                  >
                    <span class="flex items-start justify-between gap-4">
                      <span class="text-lg font-black leading-6">{{ t(option.labelKey) }}</span>
                      <span class="text-primary" aria-hidden="true">{{ form.timeline === option.value ? '✓' : '+' }}</span>
                    </span>
                    <span class="mt-3 block text-sm leading-6 text-muted">{{ t(option.descriptionKey) }}</span>
                  </button>
                </div>

                <div v-else-if="currentStepKey === 'contact'" class="mt-7 grid gap-5">
                  <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label for="full-name" class="sazan-meta text-foreground">
                        {{ t('startProject.fields.fullName') }}
                      </label>
                      <input
                        id="full-name"
                        v-model="form.contact.fullName"
                        type="text"
                        autocomplete="name"
                        required
                        class="sazan-focus mt-3 h-12 w-full border bg-background px-4 text-base text-foreground placeholder:text-muted/70"
                        :class="contactErrors.fullName ? 'border-primary' : 'border-border'"
                        :placeholder="t('startProject.placeholders.fullName')"
                        :aria-invalid="Boolean(contactErrors.fullName)"
                        :aria-describedby="contactErrors.fullName ? 'full-name-error' : undefined"
                        @input="clearContactError('fullName')"
                      >
                      <p v-if="contactErrors.fullName" id="full-name-error" class="mt-2 text-sm font-bold text-primary" role="alert">
                        {{ contactErrors.fullName }}
                      </p>
                    </div>

                    <div>
                      <label for="email" class="sazan-meta text-foreground">
                        {{ t('startProject.fields.email') }}
                      </label>
                      <input
                        id="email"
                        v-model="form.contact.email"
                        type="email"
                        autocomplete="email"
                        required
                        dir="ltr"
                        class="sazan-focus mt-3 h-12 w-full border bg-background px-4 text-base text-foreground placeholder:text-muted/70"
                        :class="contactErrors.email ? 'border-primary' : 'border-border'"
                        :placeholder="t('startProject.placeholders.email')"
                        :aria-invalid="Boolean(contactErrors.email)"
                        :aria-describedby="contactErrors.email ? 'email-error' : undefined"
                        @input="clearContactError('email')"
                      >
                      <p v-if="contactErrors.email" id="email-error" class="mt-2 text-sm font-bold text-primary" role="alert">
                        {{ contactErrors.email }}
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label for="phone" class="sazan-meta text-foreground">
                        {{ t('startProject.fields.phone') }}
                      </label>
                      <input
                        id="phone"
                        v-model="form.contact.phone"
                        type="tel"
                        autocomplete="tel"
                        dir="ltr"
                        class="sazan-focus mt-3 h-12 w-full border border-border bg-background px-4 text-base text-foreground placeholder:text-muted/70"
                        :placeholder="t('startProject.placeholders.phone')"
                      >
                    </div>

                    <div>
                      <label for="company" class="sazan-meta text-foreground">
                        {{ t('startProject.fields.company') }}
                      </label>
                      <input
                        id="company"
                        v-model="form.contact.company"
                        type="text"
                        autocomplete="organization"
                        class="sazan-focus mt-3 h-12 w-full border border-border bg-background px-4 text-base text-foreground placeholder:text-muted/70"
                        :placeholder="t('startProject.placeholders.company')"
                      >
                    </div>
                  </div>

                  <fieldset class="border border-border p-4">
                    <legend class="px-2 text-sm font-bold text-foreground">
                      {{ t('startProject.fields.preferredContactMethod') }}
                    </legend>
                    <div class="mt-3 grid gap-2 sm:grid-cols-4">
                      <button
                        v-for="option in preferredContactOptions"
                        :key="option.value"
                        type="button"
                        class="sazan-focus border px-4 py-3 text-sm font-bold transition"
                        :class="getChoiceClass(form.contact.preferredContactMethod === option.value)"
                        :aria-pressed="form.contact.preferredContactMethod === option.value"
                        @click="selectContactMethod(option.value)"
                      >
                        {{ t(option.labelKey) }}
                      </button>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-muted">
                      {{ t('startProject.steps.contact.methodHint') }}
                    </p>
                  </fieldset>
                </div>

                <div v-else class="mt-7 grid gap-6">
                  <div v-if="reviewItems.length" class="grid gap-3">
                    <article
                      v-for="item in reviewItems"
                      :key="item.step"
                      class="grid gap-4 border border-border bg-background/68 p-4 sm:grid-cols-[1fr_auto] sm:items-start"
                    >
                      <div>
                        <p class="sazan-meta text-primary">
                          {{ item.label }}
                        </p>
                        <p class="mt-3 whitespace-pre-wrap text-base leading-7 text-foreground">
                          {{ item.value }}
                        </p>
                      </div>
                      <button type="button" class="sazan-text-link w-max text-sm" @click="editStep(item.step)">
                        {{ t('common.edit') }}
                      </button>
                    </article>
                  </div>
                  <div v-else class="border border-border bg-background/68 p-5 text-sm leading-7 text-muted">
                    {{ t('startProject.review.emptyOptional') }}
                  </div>

                  <article class="border border-primary/45 bg-primary/10 p-4">
                    <div class="flex items-start justify-between gap-4">
                      <p class="sazan-meta text-primary">
                        {{ t('startProject.review.labels.contact') }}
                      </p>
                      <button type="button" class="sazan-text-link text-sm" @click="editStep('contact')">
                        {{ t('common.edit') }}
                      </button>
                    </div>
                    <dl class="mt-4 grid gap-3 sm:grid-cols-2">
                      <div v-for="item in contactReviewItems" :key="item.label">
                        <dt class="text-xs font-bold text-muted">{{ item.label }}</dt>
                        <dd class="mt-1 font-bold text-foreground">{{ item.value }}</dd>
                      </div>
                    </dl>
                  </article>
                </div>

                <p v-if="submitError" class="mt-6 border border-primary/45 bg-primary/10 p-4 text-sm font-bold text-primary" role="alert">
                  {{ submitError }}
                </p>

                <div class="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    class="sazan-button-secondary"
                    :class="currentStepIndex === 0 ? 'invisible' : ''"
                    :disabled="currentStepIndex === 0"
                    @click="goBack"
                  >
                    <span aria-hidden="true">{{ backSymbol }}</span>
                    <span>{{ t('common.back') }}</span>
                  </button>

                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      v-if="isOptionalStep"
                      type="button"
                      class="sazan-button-secondary"
                      @click="goNext"
                    >
                      {{ t('common.skip') }}
                    </button>

                    <button
                      type="submit"
                      class="sazan-button-primary"
                      :disabled="isSubmitting"
                      :aria-busy="isSubmitting"
                    >
                      <span v-if="isSubmitting">{{ t('startProject.actions.submitting') }}</span>
                      <span v-else>{{ isReviewStep ? t('startProject.actions.submit') : isContactStep ? t('startProject.actions.review') : t('common.continue') }}</span>
                      <span v-if="!isSubmitting" aria-hidden="true">{{ nextSymbol }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </form>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.lead-step-enter-active,
.lead-step-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.lead-step-enter-from,
.lead-step-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
