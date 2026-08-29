<script setup lang="ts">
type AppLocaleCode = 'fa' | 'en';

type LocaleItem = {
  code: AppLocaleCode;
  name: string;
};

const defaultLocale: AppLocaleCode = 'fa';
const localeCodes: readonly AppLocaleCode[] = ['fa', 'en'];

const route = useRoute();
const { locale, locales, setLocaleCookie, strategy } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed<LocaleItem[]>(() => {
  const configuredLocales = locales.value as Array<{ code: AppLocaleCode; name?: string }>;

  return configuredLocales.map((localeItem) => ({
    code: localeItem.code,
    name: localeItem.name || localeItem.code.toUpperCase()
  }));
});

const getPathParts = (fullPath: string) => {
  const [pathAndSearch = '/', hash = ''] = fullPath.split('#');
  const [path = '/', search = ''] = pathAndSearch.split('?');

  return {
    path: path || '/',
    search,
    hash
  };
};

const hasLocalePrefix = (path: string, localeCode: AppLocaleCode) => {
  const prefix = `/${localeCode}`;

  return path === prefix || path.startsWith(`${prefix}/`);
};

const removeLocalePrefix = (path: string) => {
  for (const localeCode of localeCodes) {
    const prefix = `/${localeCode}`;

    if (path === prefix) {
      return '/';
    }

    if (path.startsWith(`${prefix}/`)) {
      return path.slice(prefix.length) || '/';
    }
  }

  return path || '/';
};

const shouldPrefixLocale = (targetLocale: AppLocaleCode) => {
  return targetLocale !== defaultLocale || strategy === 'prefix' || strategy === 'prefix_and_default';
};

const isPathForTargetLocale = (path: string, targetLocale: AppLocaleCode) => {
  const { path: pathname } = getPathParts(path);

  if (shouldPrefixLocale(targetLocale)) {
    return hasLocalePrefix(pathname, targetLocale);
  }

  return !localeCodes.some((localeCode) => hasLocalePrefix(pathname, localeCode));
};

const localizeCurrentPath = (targetLocale: AppLocaleCode) => {
  const { path, search, hash } = getPathParts(route.fullPath);
  const unprefixedPath = removeLocalePrefix(path);
  const localizedPath = shouldPrefixLocale(targetLocale)
    ? `/${targetLocale}${unprefixedPath === '/' ? '' : unprefixedPath}`
    : unprefixedPath;

  return `${localizedPath}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
};

const getLocaleSwitchPath = (targetLocale: AppLocaleCode) => {
  const switchedPath = switchLocalePath(targetLocale);

  if (switchedPath && isPathForTargetLocale(switchedPath, targetLocale)) {
    return switchedPath;
  }

  return localizeCurrentPath(targetLocale);
};

const handleLocaleClick = async (targetLocale: AppLocaleCode, event: MouseEvent) => {
  if (targetLocale === locale.value || !import.meta.client) {
    return;
  }

  event.preventDefault();
  setLocaleCookie(targetLocale);
  await navigateTo(getLocaleSwitchPath(targetLocale));
};
</script>

<template>
  <div class="flex items-center gap-1" :aria-label="$t('language.label')">
    <a
      v-for="localeItem in availableLocales"
      :key="localeItem.code"
      :href="getLocaleSwitchPath(localeItem.code)"
      class="sazan-focus inline-flex h-8 min-w-9 items-center justify-center rounded-md px-2.5 text-xs font-medium transition-colors"
      :class="locale === localeItem.code ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-elevated hover:text-foreground'"
      :aria-current="locale === localeItem.code ? 'page' : undefined"
      :aria-label="$t('language.switchTo', { locale: localeItem.name })"
      @click="handleLocaleClick(localeItem.code, $event)"
    >
      {{ localeItem.code.toUpperCase() }}
    </a>
  </div>
</template>
