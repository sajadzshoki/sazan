import type { LocalizedString, ProjectRequestStatus, PublishStatus } from '~~/types';

export const adminRequestStatuses = ['new', 'reviewing', 'contacted', 'inProgress', 'completed', 'archived'] as const satisfies readonly ProjectRequestStatus[];
export const adminPublishStatuses = ['draft', 'review', 'published', 'archived'] as const satisfies readonly PublishStatus[];

export const useAdminHelpers = () => {
  const { locale, t } = useI18n();

  const localeCode = computed(() => (locale.value === 'fa' ? 'fa' : 'en'));

  const localize = (value?: Partial<LocalizedString> | null) => {
    if (!value) {
      return '';
    }

    return value[localeCode.value] || value.en || value.fa || '';
  };

  const formatDate = (value?: string | Date) => {
    if (!value) {
      return '—';
    }

    try {
      return new Intl.DateTimeFormat(locale.value === 'fa' ? 'fa-IR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(value));
    } catch {
      return '—';
    }
  };

  const publishStatusLabel = (status?: PublishStatus | string) => t(`admin.status.publish.${status || 'draft'}`);
  const requestStatusLabel = (status?: ProjectRequestStatus | string) => t(`admin.status.request.${status || 'new'}`);

  const publishStatusClass = (status?: string) => {
    if (status === 'published') {
      return 'border-accent/35 bg-accent/10 text-accent';
    }

    if (status === 'review') {
      return 'border-primary/35 bg-primary/10 text-primary';
    }

    if (status === 'archived') {
      return 'border-muted/35 bg-muted/10 text-muted';
    }

    return 'border-border bg-elevated/50 text-muted';
  };

  const requestStatusClass = (status?: string) => {
    if (status === 'new') {
      return 'border-primary/35 bg-primary/10 text-primary';
    }

    if (status === 'completed') {
      return 'border-accent/35 bg-accent/10 text-accent';
    }

    if (status === 'archived') {
      return 'border-muted/35 bg-muted/10 text-muted';
    }

    return 'border-border bg-elevated/60 text-foreground';
  };

  return {
    localeCode,
    localize,
    formatDate,
    publishStatusLabel,
    requestStatusLabel,
    publishStatusClass,
    requestStatusClass
  };
};
