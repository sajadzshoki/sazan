export type AppDirection = 'ltr' | 'rtl';

export const useAppDirection = () => {
  const { locale, localeProperties } = useI18n();

  const direction = computed<AppDirection>(() => {
    const configuredDirection = localeProperties.value?.dir;

    if (configuredDirection === 'rtl' || configuredDirection === 'ltr') {
      return configuredDirection;
    }

    return locale.value === 'fa' ? 'rtl' : 'ltr';
  });

  const language = computed(() => localeProperties.value?.language || (locale.value === 'fa' ? 'fa-IR' : 'en-US'));
  const isRtl = computed(() => direction.value === 'rtl');

  return {
    direction,
    language,
    isRtl
  };
};
