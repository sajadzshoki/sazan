import type { LocaleCode, LocalizedString } from '~~/types';

export const resolveLocalizedString = (
  value: LocalizedString | undefined,
  locale: LocaleCode,
  fallbackLocale: LocaleCode = 'en'
) => {
  if (!value) {
    return '';
  }

  return value[locale] || value[fallbackLocale] || '';
};
